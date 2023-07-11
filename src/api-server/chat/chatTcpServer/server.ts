import { BroadcastOperator } from 'socket.io';
import { makeChatRepository } from 'data/chat/factory';
import { EventNames, EventParams } from 'socket.io/dist/typed-events';
import {
  ChatMessageModel,
  ChatMessageStatus,
  SendChatMessageModel,
} from '../domain/models/chatMessage';
import makeSendChatMessage from '../factories/usecases/sendChatTextMessageFactory';
import makeLoadMessagesForRecipient from '../factories/usecases/loadMessagesForRecipientFactory';
import makeUpdateMessageStatus from '../factories/usecases/updateMessageStatusFactory';
import { ChatMessagesContext } from '../domain/models/chatContext';
import makeCreateChat from '../factories/usecases/createChatFactory';
import { ChatBrain, ChatModel } from '../domain/models/chat';
import makeSetVoiceMessageTranscription from '../factories/usecases/setVoiceMessageTranscriptionFactory';
import { CreateChat } from '../domain/usecases/createChat';
import makeUpdateChatBrains from '../factories/usecases/updateChatBrainsFactory';
import { UpdateChatBrains } from '../domain/usecases/updateChatBrains';
import {
  ChatCreatedEvent,
  ChatListEvent,
  MessageReceivedEvent,
  MessageSentEvent,
  MessageTranscribedEvent,
  MessageUpdatedEvent,
  ServerToClientEvents,
  CreateChatEvent,
  GetChatEvent,
  GetMessagesEvent,
  JoinChatEvent,
  MessagesReceivedAckEvent,
  SendMessageEvent,
  TranscribeVoiceMessageEvent,
  UpdateChatBrainsEvent,
} from './events';
import { ChatNamespace, ChatSocket } from './models/server';

class ChatServer {
  private server: ChatNamespace | undefined;

  public startServer(server: ChatNamespace) {
    this.server = server;
    server.on('connection', this.onClientConnected.bind(this));
  }

  private async onClientConnected(socket: ChatSocket): Promise<void> {
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
    socket.emit(ChatListEvent.Name, {
      chats: clientMessages,
    });
  }

  private onChatClientConnected(socket: ChatSocket): void {
    console.log(`new client connected: ${socket.id}`);
    socket.on(JoinChatEvent.Name, async ({ chatId }, callback) => {
      const chatRoom = this.getChatRoom(chatId);
      socket.join(chatRoom);

      const messages = await this.getChatMessages(chatId);
      callback(messages);
    });

    socket.on(
      SendMessageEvent.Name,
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

    socket.on(GetMessagesEvent.Name, async ({ recipientId }, callback) => {
      const loadMessagesUseCase = await makeLoadMessagesForRecipient();
      const messages = await loadMessagesUseCase.loadMessages({
        recipientId,
      });
      callback(messages);
    });

    socket.on(
      MessagesReceivedAckEvent.Name,
      this.onMessagesReceivedAck.bind(this)
    );

    socket.on(
      CreateChatEvent.Name,
      async (options: CreateChat.Params, callback) => {
        const createChat = await makeCreateChat();
        const chat = await createChat.create(options);
        socket.emit(ChatCreatedEvent.Name, chat);
        callback(chat);
      }
    );

    socket.on(
      TranscribeVoiceMessageEvent.Name,
      async (event: TranscribeVoiceMessageEvent.Params, callback) => {
        const setMessageTranscription =
          await makeSetVoiceMessageTranscription();
        const result = await setMessageTranscription.setTranscription({
          messageId: event.message.id,
          transcription: event.transcription,
        });
        this.notifyMessageUpdate(event.message, result);

        const chat = await this.getChat(event.message.chat);

        this.broadcastToChatParticipants(
          chat,
          (brain) => brain.handleMessageType === 'text'
        )?.emit(MessageTranscribedEvent.Name, result);

        callback?.();
      }
    );

    socket.on(GetChatEvent.Name, async (chatId: string, callback) => {
      const chat = await this.getChat(chatId);
      callback(chat);
    });

    socket.on(
      UpdateChatBrainsEvent.Name,
      async (event: UpdateChatBrains.Params, callback) => {
        const updateChatBrains = await makeUpdateChatBrains();
        const chat = await updateChatBrains.update(event);
        callback(chat);
      }
    );

    socket.on('disconnect', (reason) => {
      console.log(`client disconnected: ${socket.id}, reason: ${reason}`);
    });
  }

  private onMessagesReceivedAck = async (
    event: MessagesReceivedAckEvent.Params
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

  private async notifyMessageUpdate(
    prevMessage: ChatMessageModel,
    message: ChatMessageModel
  ): Promise<void> {
    this.broadcastToChatParticipants(await this.getChat(message.chat))?.emit(
      MessageUpdatedEvent.Name,
      {
        prevMessage,
        message,
      }
    );
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
    this.sendToClient(id, MessageReceivedEvent.Name, message, async () => {
      // This callback is called when the message is ack by the brain server
      await this.onMessagesReceivedAck({ messages: [message] });
    });
  }

  public onMessageSent(id: string, message: ChatMessageModel): void {
    this.sendToClient(id, MessageSentEvent.Name, message);
  }

  public broadcastToChatParticipants(
    chat: ChatModel,
    brainFilter: (brain: ChatBrain) => boolean = () => true
  ): BroadcastOperator<ServerToClientEvents, any> | undefined {
    if (!chat) {
      console.error(`Could not send message to chat because it does not exist`);
      return undefined;
    }

    const brainIds = chat.brains
      .filter(brainFilter)
      .map((brain) => this.getClientRoom(brain.id));

    return this.server?.to([this.getChatRoom(chat.id), ...brainIds]);
  }

  public sendToClient<Ev extends EventNames<ServerToClientEvents>>(
    id: string,
    ev: Ev,
    ...args: EventParams<ServerToClientEvents, Ev>
  ): void {
    this.server?.to(this.getClientRoom(id)).emit(ev, ...args);
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
    const chat = await this.getChat(id);
    return new ChatMessagesContext(chat, chat.messages ?? []);
  }

  private async getChat(id: string): Promise<ChatModel> {
    const repository = await makeChatRepository();

    const chat = await repository.get(id);
    if (!chat) throw new Error(`Could not find chat with id ${id}`);

    return chat;
  }
}

export default new ChatServer();
