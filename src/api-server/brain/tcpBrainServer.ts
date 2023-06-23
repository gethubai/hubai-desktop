import { io } from 'socket.io-client';
import { Socket } from 'socket.io';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { IBrainServer } from './brainServer';
import {
  IAudioTranscriberBrainService,
  IBrainService,
  ITextBrainService,
} from './brainService';
import { IBrainSettings } from './brainSettings';

export default class TcpBrainServer implements IBrainServer {
  private socket!: Socket;

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

    this.socket.on('messageReceived', this.onMessageReceived.bind(this));

    this.socket.on(
      'onMessageTranscribed',
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
    const { id, nameAlias } = this.getSettings();

    return new SendChatMessageModel(
      message.chat,
      nameAlias,
      id,
      'brain',
      message.senderId
    );
  }

  private async sendMessageReceivedAck(messages: ChatMessageModel[]) {
    this.socket?.emit('messagesReceivedAck', {
      messages,
    });
  }

  public sendMessageTranscription(message: ChatMessageModel, text: string) {
    this.socket?.emit('transcribeVoiceMessage', {
      message,
      transcription: text,
    });
  }

  public sendMessage(message: SendChatMessageModel) {
    this.socket?.emit('sendMessage', message);
  }

  public getSettings(): IBrainSettings {
    return this.defaultBrainSettings;
  }
}
