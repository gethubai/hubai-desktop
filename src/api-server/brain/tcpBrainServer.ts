import { io } from 'socket.io-client';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { ChatClientSocket } from 'api-server/chat/chatTcpServer/models/serverClient';
import {
  MessagesReceivedAckEvent,
  SendMessageEvent,
  TranscribeVoiceMessageEvent,
  MessageReceivedEvent,
  MessageTranscribedEvent,
} from 'api-server/chat/chatTcpServer/events';
import { IBrainServer } from './brainServer';
import {
  IAudioTranscriberBrainService,
  IBrainService,
  ITextBrainService,
  SetUserSettingsResult,
} from './brainService';
import { IBrainSettings } from './brainSettings';

export default class TcpBrainServer implements IBrainServer {
  private socket!: ChatClientSocket;

  private userSettingsResult?: SetUserSettingsResult;

  constructor(
    private readonly brainService: IBrainService,
    private readonly defaultBrainSettings: IBrainSettings
  ) {}

  start(hostUrl: string): Promise<void> {
    this.socket = io(hostUrl, {
      query: {
        type: 'brainClient',
        id: this.getClientId(),
      },
    });

    this.socket.on('connect', () => {
      console.log('connected to chat server: ', this.getSettings());
    });

    this.socket.on(
      MessageReceivedEvent.Name,
      this.onMessageReceived.bind(this)
    );

    this.socket.on(
      MessageTranscribedEvent.Name,
      this.onMessageTranscribed.bind(this)
    );

    return Promise.resolve();
  }

  getClientId(): string {
    return this.getSettings().id;
  }

  getService(): IBrainService {
    return this.brainService;
  }

  disconnect(): Promise<void> {
    this.socket.disconnect();
    return Promise.resolve();
  }

  private async onMessageReceived(
    message: ChatMessageModel,
    callback: () => void
  ) {
    console.log('messages received from chat server', message);

    callback();

    if (!this?.userSettingsResult?.success) {
      const reply = this.getMessageReply(message);
      reply.setText({
        body: `You must configure the following settings before using this brain: \n ${this.userSettingsResult?.errors.join(
          '\n'
        )}`,
      });
      this.sendMessage(reply);
      return;
    }

    if (message.messageType === 'text') {
      await this.replyWithTextPrompt(message);
    } else if (message.messageType === 'voice') {
      await this.transcribeMessage(message);
    }
  }

  private async onMessageTranscribed(message: ChatMessageModel) {
    await this.replyWithTextPrompt(message);
  }

  private async transcribeMessage(message: ChatMessageModel) {
    const reply = this.getMessageReply(message);

    const transcriberService = this
      .brainService as IAudioTranscriberBrainService;

    if (!message.voice?.file) {
      throw new Error('No voice file found in message');
    }

    if (transcriberService) {
      return transcriberService
        .transcribeAudio({
          audioFilePath: message.voice.file,
          language: '', // TODO: Allow support for other languages
        })
        .then((promptResult) => {
          this.sendMessageTranscription(message, promptResult.result);
        })
        .catch((err) => {
          console.error(err, 'error transcribing voice message');

          reply.setText({
            body: `An error occurred while transcribing message:\n ${err.message}`,
          });

          this.sendMessage(reply);
        });
    }

    reply.setText({ body: 'This brain does not support audio transcriptions' });
    this.sendMessage(reply);

    return Promise.resolve();
  }

  private async replyWithTextPrompt(message: ChatMessageModel) {
    const reply = this.getMessageReply(message);

    const textService = this.brainService as ITextBrainService;

    if (textService) {
      // const result = await brain.sendTextPrompt(prompts);
      // res.send({ brainId: brain.getSettings().id, result: result.result });
      return textService
        .sendTextPrompt([{ role: 'user', message: message.text?.body }])
        .then((promptResult) => {
          reply.setText({
            body: promptResult.result,
          });
        })
        .catch((err) => {
          console.error(err, 'error sending text prompt');

          reply.setText({
            body: `An error occurred while sending text prompt:\n ${err.message}`,
          });
        })
        .finally(() => {
          this.sendMessage(reply);
        });
    }

    reply.setText({ body: 'This brain does not support text prompts' });
    this.sendMessage(reply);

    return Promise.resolve();
  }

  private getMessageReply(message: ChatMessageModel): SendChatMessageModel {
    const { id, displayName } = this.getSettings();

    return new SendChatMessageModel(
      message.chat,
      displayName,
      id,
      'brain',
      message.senderId
    );
  }

  private async sendMessageReceivedAck(messages: ChatMessageModel[]) {
    this.socket?.emit(MessagesReceivedAckEvent.Name, {
      messages,
    });
  }

  public sendMessageTranscription(message: ChatMessageModel, text: string) {
    this.socket?.emit(TranscribeVoiceMessageEvent.Name, {
      message,
      transcription: text,
    });
  }

  public sendMessage(message: SendChatMessageModel) {
    this.socket?.emit(SendMessageEvent.Name, message);
  }

  public getSettings(): IBrainSettings {
    return this.defaultBrainSettings;
  }

  setUserSettingsResult(result: SetUserSettingsResult): void {
    this.userSettingsResult = result;
  }
}
