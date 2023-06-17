import { io } from 'socket.io-client';
import { Socket } from 'socket.io';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { IBrainServer } from './brainServer';
import { IBrainService, ITextBrainService } from './brainService';
import { IBrainSettings } from './brainSettings';

export default class TcpBrainServer implements IBrainServer {
  private socket!: Socket;

  constructor(private readonly brainService: IBrainService) {}

  start(hostUrl: string): Promise<void> {
    this.socket = io(hostUrl, {
      query: {
        type: 'brainClient',
        id: this.getSettings().id,
      },
    });

    this.socket.on('connect', () => {
      console.log('connected to chat server: ', this.getSettings());
    });

    this.socket.on('messageReceived', this.onMessageReceived.bind(this));
    return Promise.resolve();
  }

  private async onMessageReceived(
    message: ChatMessageModel,
    callback: () => void
  ) {
    console.log('messages received from chat server', message);

    callback();

    await this.replyWithTextPrompt(message);
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
    return new SendChatMessageModel(
      message.chat,
      this.getSettings().name,
      this.getSettings().id,
      'brain',
      message.senderId
    );
  }

  private async sendMessageReceivedAck(messages: ChatMessageModel[]) {
    this.socket?.emit('messagesReceivedAck', {
      messages,
    });
  }

  public sendMessage(message: SendChatMessageModel) {
    console.log('sending message:', message);
    this.socket?.emit('sendMessage', message);
  }

  public getSettings(): IBrainSettings {
    return this.brainService.getSettings();
  }
}
