import { Server, Socket } from 'socket.io';
import { CreateChatOptions } from 'renderer/features/chat/models/chat';
import makeChatDatabase from './factories/databaseFactory';
import {
  ChatMessageModel,
  ChatMessageStatus,
  SendChatMessageModel,
} from './domain/models/chatMessage';
import makeSendChatMessage from './factories/usecases/sendChatTextMessageFactory';
import makeLoadMessagesForRecipient from './factories/usecases/loadMessagesForRecipientFactory';
import makeUpdateMessageStatus from './factories/usecases/updateMessageStatusFactory';
import { ChatMessagesContext } from './domain/models/chatContext';
import makeCreateChat from './factories/usecases/createChatFactory';
import { ChatModel } from './domain/models/chat';

type MessagesReceivedAckEvent = {
  messages: ChatMessageModel[];
};

class ChatServer {
  private server: Server | undefined;

  public startServer(server: Server) {
    this.server = server;

    server.on('connection', this.onClientConnected.bind(this));
  }

  private async onClientConnected(socket: Socket): Promise<void> {
    const { id } = socket.handshake.query;

    const roomId = this.getClientRoom(id as string);
    socket.join(roomId);

    console.log(`client ${socket.id} joined room ${roomId}`);

    this.onChatClientConnected(socket);

    const clientMessages = await this.getClientMessages(id as string);
    socket.emit('chatsLoaded', { chats: clientMessages });
  }

  private onChatClientConnected(socket: Socket): void {
    console.log(`new client connected: ${socket.id}`);
    socket.on('join', async ({ chatId }, callback) => {
      const messages = await this.getChatMessages(chatId);
      callback(messages);
    });

    socket.on(
      'sendMessage',
      async (message: SendChatMessageModel, callback) => {
        const sendUseCase = await makeSendChatMessage();
        const addedMessage = await sendUseCase.send(message);
        this.onMessageSent(message.senderId, addedMessage);
        this.sendMessageToRecipient(message.to, addedMessage);

        callback?.(addedMessage);
      }
    );

    socket.on('getMessages', async ({ recipientId }, callback) => {
      const loadMessagesUseCase = await makeLoadMessagesForRecipient();
      const messages = await loadMessagesUseCase.loadMessages(recipientId);
      callback(messages);
    });

    socket.on('messagesReceivedAck', this.onMessagesReceivedAck.bind(this));

    socket.on('createChat', async (options: CreateChatOptions, callback) => {
      const createChat = await makeCreateChat();
      const chat = await createChat.create(options);
      socket.emit('chatCreated', chat);
      callback(chat);
    });

    socket.on('disconnect', (reason) => {
      console.log(`client disconnected: ${socket.id}`);
    });
  }

  private onMessagesReceivedAck = async (
    event: MessagesReceivedAckEvent
  ): Promise<void> => {
    const { messages } = event;

    const messageIds = messages.map((message) => message.id);
    await this.updateMessageStatus(messageIds, ChatMessageStatus.DELIVERED);

    messages.forEach((message) => {
      const updatedMessage = {
        ...message,
        status: ChatMessageStatus.DELIVERED,
      };

      this.sendToClient(message.senderId, 'messageUpdated', updatedMessage);
    });
  };

  private async updateMessageStatus(
    messageIds: string[],
    newStatus: ChatMessageStatus
  ): Promise<void> {
    const messageStatus = await makeUpdateMessageStatus();
    await messageStatus.update({
      messageIds,
      newStatus,
    });
  }

  public sendMessageToRecipient(id: string, message: ChatMessageModel): void {
    this.sendToClient(id, 'messageReceived', message, async () => {
      // This callback is called when the message is ack by the brain server
      await this.onMessagesReceivedAck({ messages: [message] });
    });
  }

  public onMessageSent(id: string, message: ChatMessageModel): void {
    this.sendToClient(id, 'messageSent', message);
  }

  public sendToClient(
    id: string,
    event: string,
    data: any,
    callback: any = undefined
  ): void {
    this.server?.to(this.getClientRoom(id)).emit(event, data, callback);
  }

  private getClientRoom(id: string): string {
    return `chatClient:${id}`;
  }

  private async getClientMessages(id: string): Promise<ChatMessagesContext[]> {
    const messagesLoader = await makeLoadMessagesForRecipient();
    const messages = await messagesLoader.loadMessages({ recipientId: id });

    return messages;
  }

  private async getChatMessages(id: string): Promise<ChatMessagesContext> {
    // TODO: Refactor this and use useCase
    const db = await makeChatDatabase();
    const chat = await db.chat.findOne(id).exec();
    const messages = await db.messages
      .find({
        selector: {
          chat: {
            $eq: chat?.id,
          },
        },
      })
      .sort({ sendDate: 1 })
      .exec();
    return new ChatMessagesContext(chat._data as ChatModel, messages);
  }
}

export default new ChatServer();
