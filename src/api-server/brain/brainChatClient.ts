import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import {
  IChatClient,
  IChatSessionServer,
} from 'renderer/features/chat/sdk/contracts';
import { ChatClient } from 'renderer/features/chat/sdk/chatClient';
import { ChatMemberType, ChatModel } from 'api-server/chat/domain/models/chat';
import path from 'path';
import { getMessageAudioStoragePath } from 'utils/pathUtils';
import { IBrainServer } from './brainServer';
import {
  IAudioTranscriberBrainService,
  IBrainPromptContext,
  IBrainService,
  ITextBrainService,
} from './brainService';
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
      name: this.getSettings().displayName,
      type: ChatMemberType.brain,
    });

    const chats = await this.chatClient.chats();
    await this.joinChats(chats);

    this.chatClient.onChatCreated((chat) => {
      this.joinChats([chat]);
    });

    this.chatClient.onJoinedChat((chat) => {
      console.log(`${this.getSettings().displayName}: joined chat: ${chat.id}`);
      this.joinChats([chat]);
    });

    this.chatClient.onLeftChat((chat) => {
      console.log(`${this.getSettings().displayName}: left chat: ${chat.id}`);

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

      session.onMessageReceived((message) => {
        return this.onMessageReceived(message, session);
      });
    });
  }

  getClientId(): string {
    return this.getSettings().id;
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
      chatId: message.chat,
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

    const name = path.basename(message.voice.file);
    const audioFilePath = getMessageAudioStoragePath(name);

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
      return textService
        .sendTextPrompt(
          [{ role: 'user', message: message.text!.body }],
          context
        )
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

  public getSettings(): IBrainSettings {
    return this.defaultBrainSettings;
  }

  private getUserSettings(): any {
    return this.userSettings;
  }

  public setUserSettings(settings: any) {
    this.userSettings = settings;
  }
}
