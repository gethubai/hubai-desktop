import { io } from 'socket.io-client';
import { Socket } from 'socket.io';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { IBrainServer } from './brainServer';
import { IBrainService } from './brainService';
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

    const reply = new SendChatMessageModel(
      message.chat,
      this.getSettings().name,
      this.getSettings().id,
      'brain',
      message.senderId
    );

    reply.setText({
      body: `Sorry i'm too dumb to answer that: ${new Date().toLocaleString()}`,
    });

    setTimeout(() => {
      this.sendMessage(reply);
    }, 1000);

    callback();
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
