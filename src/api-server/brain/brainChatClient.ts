import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import {
  IChatClient,
  IChatSessionServer,
} from 'renderer/features/chat/sdk/contracts';
import { ChatClient } from 'renderer/features/chat/sdk/chatClient';
import { ChatMemberType, ChatModel } from 'api-server/chat/domain/models/chat';
import { getMessageStoragePathFromUrl } from 'utils/pathUtils';
import {
  FileAttachment,
  IAudioTranscriberBrainService,
  IBrainPromptContext,
  IBrainService,
  ITextBrainService,
  TextBrainPrompt,
} from '@hubai/brain-sdk';
import { IBrainServer } from './brainServer';
import { IBrainSettings } from './brainSettings';

export default class BrainChatClient implements IBrainServer {
  private chatClient!: IChatClient;

  private userSettings: any;

  constructor(
    private readonly brainService: IBrainService,
    private readonly defaultBrainSettings: IBrainSettings
  ) {}

  async start(): Promise<void> {
    this.chatClient = new ChatClient();

    await this.chatClient.connect({
      id: this.getClientId(),
      name: this.getBrain().displayName,
      type: ChatMemberType.brain,
    });

    const chats = await this.chatClient.chats();
    await this.joinChats(chats);

    this.chatClient.onChatCreated((chat) => {
      this.joinChats([chat]);
    });

    this.chatClient.onJoinedChat((chat) => {
      this.joinChats([chat]);
    });

    this.chatClient.onLeftChat((chat) => {
      console.log(`${this.getBrain().displayName}: left chat: ${chat.id}`);

      const session = this.chatClient.session(chat.id);
      if (session?.isWatching) {
        session.unwatch();
      }
    });
  }

  async joinChats(chats: ChatModel[]) {
    chats.forEach(async (chat) => {
      const session = this.chatClient.session(chat.id);
      if (session.isWatching) return;

      await session.watch();

      console.log(`${this.getBrain().displayName}: joined chat: ${chat.id}`);

      session.onMessageReceived((message) => {
        return this.onMessageReceived(message, session);
      });
    });
  }

  getClientId(): string {
    return this.getBrain().id;
  }

  getService(): IBrainService {
    return this.brainService;
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  private async onMessageReceived(
    message: ChatMessageModel,
    session: IChatSessionServer
  ) {
    // We won't reply to our own messages
    if (message.senderId === this.getClientId()) return;

    const sessionSettings = (await session.getSettings()) || {};
    const settings = { ...this.getUserSettings(), ...sessionSettings };

    const context = {
      id: message.id,
      conversationId: message.chat,
      senderId: message.senderId,
      settings,
    } as IBrainPromptContext<any>;

    if (message.messageType === 'text' && message.text?.body) {
      await this.replyWithTextPrompt(message, session, context);
    } else if (message.voice?.file) {
      await this.transcribeMessage(message, session, context);
    }
  }

  private async transcribeMessage(
    message: ChatMessageModel,
    session: IChatSessionServer,
    context: IBrainPromptContext<any>
  ) {
    const transcriberService = this
      .brainService as IAudioTranscriberBrainService<any>;

    if (!message.voice?.file) {
      throw new Error('No voice file found in message');
    }

    // todo: replace with the way above
    const audioFilePath = getMessageStoragePathFromUrl(message.voice.file);

    if (transcriberService) {
      return transcriberService
        .transcribeAudio(
          {
            audioFilePath,
            language: '', // TODO: Allow support for other languages
          },
          context
        )
        .then((promptResult) => {
          if (promptResult.validationResult?.success === false) {
            session.sendMessage({
              text: { body: promptResult.validationResult.getMessage() },
            });
          } else if (promptResult.result) {
            session.sendTranscription(message.id, {
              body: promptResult.result,
            });
          }
        })
        .catch((err) => {
          console.error(err, 'error transcribing voice message');

          session.sendMessage({
            text: {
              body: `An error occurred while transcribing message:\n ${err.message}`,
            },
          });
        });
    }

    session.sendMessage({
      text: {
        body: 'This brain does not support audio transcriptions',
      },
    });

    return Promise.resolve();
  }

  private async replyWithTextPrompt(
    message: ChatMessageModel,
    session: IChatSessionServer,
    context: IBrainPromptContext<any>
  ) {
    const textService = this.brainService as ITextBrainService<any>;

    if (textService) {
      // const result = await brain.sendTextPrompt(prompts);
      // res.send({ brainId: brain.getSettings().id, result: result.result });

      const messages = await session.messages();

      const prompts = messages.messages
        .filter((m) => m.messageType === 'text' && m.text?.body)
        .map(
          (m) =>
            ({
              role: m.senderId === message.senderId ? 'user' : 'brain',
              message: m.text!.body,
              attachments: m.attachments?.map(
                (a) =>
                  ({
                    id: a.id,
                    path: getMessageStoragePathFromUrl(a.file),
                    mimeType: a.mimeType,
                    originalFileName: a.originalFileName,
                    size: a.size,
                  } as FileAttachment)
              ),
            } as TextBrainPrompt)
        );

      return textService
        .sendTextPrompt(prompts, context)
        .then((promptResult) => {
          if (promptResult.validationResult?.success === false) {
            session.sendMessage({
              text: { body: promptResult.validationResult.getMessage() },
            });
          } else if (promptResult.result) {
            session.sendMessage({ text: { body: promptResult.result } });
          }
        })
        .catch((err) => {
          console.error(err, 'error sending text prompt');

          session.sendMessage({
            text: {
              body: `An error occurred while sending text prompt:\n ${err.message}`,
            },
          });
        });
    }

    await session.sendMessage({
      text: {
        body: 'This brain does not support text prompts',
      },
    });
    return Promise.resolve();
  }

  public getBrain(): IBrainSettings {
    return this.defaultBrainSettings;
  }

  public getUserSettings(): any {
    return this.userSettings;
  }

  public setUserSettings(settings: any) {
    this.userSettings = settings;
  }
}
