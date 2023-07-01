import { Server, Socket } from 'socket.io';
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
import { ChatBrain, ChatModel } from './domain/models/chat';
import makeSetVoiceMessageTranscription from './factories/usecases/setVoiceMessageTranscriptionFactory';
import { CreateChat } from './domain/usecases/createChat';
import makeUpdateChatBrains from './factories/usecases/updateChatBrainsFactory';
import { UpdateChatBrains } from './domain/usecases/updateChatBrains';

type MessagesReceivedAckEvent = {
  messages: ChatMessageModel[];
};

type TranscribeVoiceMessageEvent = {
  message: ChatMessageModel;
  transcription: string;
};

class ChatServer {
  private server: Server | undefined;

  public startServer(server: Server) {
    this.server = server;

    server.on('connection', this.onClientConnected.bind(this));
  }

  private async onClientConnected(socket: Socket): Promise<void> {
    const { id } = socket.handshake.query;

    if (!id) {
      console.warn('client connected without a valid id');
      return;
    }

    const roomId = this.getClientRoom(id as string);
    await socket.join(roomId);

    console.log(`client ${socket.id} joined room ${roomId}`);

    this.onChatClientConnected(socket);

    const clientMessages = await this.getClientMessages(id as string);
    socket.emit('chatsLoaded', { chats: clientMessages });
  }

  private onChatClientConnected(socket: Socket): void {
    console.log(`new client connected: ${socket.id}`);
    socket.on('join', async ({ chatId }, callback) => {
      const chatRoom = this.getChatRoom(chatId);
      socket.join(chatRoom);

      const messages = await this.getChatMessages(chatId);
      callback(messages);
    });

    socket.on(
      'sendMessage',
      async (message: SendChatMessageModel, callback) => {
        const sendUseCase = await makeSendChatMessage();
        const addedMessage = await sendUseCase.send(message);
        this.onMessageSent(message.senderId, addedMessage);

        // Check if we are sending a message to ourself and if we have a recipient
        if (message.senderId !== message.to && message.to) {
          this.sendMessageToRecipient(message.to, addedMessage);
        }

        callback?.(addedMessage);
      }
    );

    socket.on('getMessages', async ({ recipientId }, callback) => {
      const loadMessagesUseCase = await makeLoadMessagesForRecipient();
      const messages = await loadMessagesUseCase.loadMessages(recipientId);
      callback(messages);
    });

    socket.on('messagesReceivedAck', this.onMessagesReceivedAck.bind(this));

    socket.on('createChat', async (options: CreateChat.Params, callback) => {
      const createChat = await makeCreateChat();
      const chat = await createChat.create(options);
      socket.emit('chatCreated', chat);
      callback(chat);
    });

    socket.on(
      'transcribeVoiceMessage',
      async (event: TranscribeVoiceMessageEvent, callback) => {
        const setMessageTranscription =
          await makeSetVoiceMessageTranscription();
        const result = await setMessageTranscription.setTranscription({
          messageId: event.message.id,
          transcription: event.transcription,
        });
        this.notifyMessageUpdate(event.message, result);

        const chat = await this.getChat(event.message.chat);

        this.sendToChatParticipants(
          chat.id,
          'onMessageTranscribed',
          result,
          undefined,
          (brain) => brain.handleMessageType === 'text' // We notify the text brains about the transcription
        );

        callback?.();
      }
    );

    socket.on('getChat', async (chatId: string, callback) => {
      const chat = await this.getChat(chatId);
      callback(chat);
    });

    socket.on(
      'updateChatBrains',
      async (event: UpdateChatBrains.Params, callback) => {
        const updateChatBrains = await makeUpdateChatBrains();
        const chat = await updateChatBrains.update(event);
        callback(chat);
      }
    );

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

      this.notifyMessageUpdate(message, updatedMessage);
    });
  };

  private notifyMessageUpdate(
    prevMessage: ChatMessageModel,
    message: ChatMessageModel
  ): void {
    this.sendToChatParticipants(message.chat, 'messageUpdated', {
      prevMessage,
      message,
    });
  }

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

  public async sendToChatParticipants(
    chatId: string,
    event: string,
    data: any,
    callback = undefined,
    brainFilter: (brain: ChatBrain) => boolean = () => true
  ): Promise<void> {
    const chat = await this.getChat(chatId);

    if (!chat) {
      console.error(
        `Could not send message ${event} to chat ${chatId} because it does not exist`
      );
      return;
    }

    const brainIds = chat.brains
      .filter(brainFilter)
      .map((brain) => this.getClientRoom(brain.id));

    this.server
      ?.to([this.getChatRoom(chatId), ...brainIds])
      .emit(event, data, callback);
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

  private getChatRoom(id: string): string {
    return `chat:${id}`;
  }

  private async getClientMessages(id: string): Promise<ChatMessagesContext[]> {
    const messagesLoader = await makeLoadMessagesForRecipient();
    const messages = await messagesLoader.loadMessages({ recipientId: id });

    return messages;
  }

  private async getChatMessages(id: string): Promise<ChatMessagesContext> {
    // TODO: Refactor this and use useCase
    const db = await makeChatDatabase();
    const chat = await this.getChat(id);
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
    return new ChatMessagesContext(chat, messages);
  }

  private async getChat(id: string): Promise<ChatModel> {
    // TODO: Do this using a useCase
    const db = await makeChatDatabase();
    const chat = await db.chat.findOne(id).exec();
    return chat?._data as ChatModel;
  }
}

export default new ChatServer();
