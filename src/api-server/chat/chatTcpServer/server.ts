import { ChatMemberStatus, ChatModel } from '../domain/models/chat';
import { ChatCreatedEventName } from './events';
import {
  MessagesReceivedAckEventName,
  MessagesReceivedAckEventParams,
} from './events/clientSessionEvents';
import {
  ChatMessageModel,
  ChatMessageStatus,
} from '../domain/models/chatMessage';
import makeUpdateMessageStatus from '../factories/usecases/updateMessageStatusFactory';
import { IServerEventEmitter } from './pubsub/models/eventEmitter';
import {
  ChatUpdatedEventName,
  JoinChatEventName,
  LeftChatEventName,
  MessageReceivedEventName,
  MessageUpdatedEventName,
  ChatMemberStatusChangedEventName,
} from './events/serveSessionEvents';
import { IChatTransport } from './models/chatTransport';
import { IChatServerClient } from './models/chatServerClient';

class ChatServer {
  transport!: IChatTransport;

  public eventEmitter!: IServerEventEmitter;

  public startServer(transport: IChatTransport) {
    this.transport = transport;
    this.eventEmitter = transport.eventEmitter;
    transport.onConnection(this.onClientConnected.bind(this));
  }

  private async onClientConnected(client: IChatServerClient): Promise<void> {
    const { id } = client;
    if (!id) {
      console.warn('client connected without a valid id');
      return;
    }
    console.log(`client ${id} connected`);

    this.onChatClientConnected(client);

    client.subscriber.subscribe(
      MessagesReceivedAckEventName,
      async (event: MessagesReceivedAckEventParams) => {
        const { messages } = event;

        const messageIds = messages.map((message) => message.id);
        await this.updateMessageStatus(messageIds, ChatMessageStatus.DELIVERED);

        messages.forEach((message) => {
          const updatedMessage = {
            ...message,
            status: ChatMessageStatus.DELIVERED,
          };

          this.eventEmitter.publish(
            {
              name: MessageUpdatedEventName,
              chatId: message.chat,
            },
            { prevMessage: message, message: updatedMessage }
          );
        });
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

  private onChatClientConnected(client: IChatServerClient): void {
    console.log(`new client connected: ${client.id}`);

    client.onDisconnect(() => {
      console.log(`client disconnected: ${client.id}`);
    });
  }

  public notifyMessageUpdated(
    message: ChatMessageModel,
    prevMessage?: ChatMessageModel
  ): void {
    message.recipients.forEach((recipient) => {
      this.eventEmitter.publish(
        {
          name: MessageUpdatedEventName,
          chatId: message.chat,
          user: recipient.id,
        },
        { prevMessage, message }
      );
    });
  }

  public notifyMessageReceived(message: ChatMessageModel): void {
    message.recipients.forEach((recipient) => {
      this.sendMessageReceivedToRecipient(message, recipient.id);
    });
  }

  public sendMessageReceivedToRecipient(
    message: ChatMessageModel,
    recipientId: string
  ): void {
    this.eventEmitter.publish(
      {
        name: MessageReceivedEventName,
        chatId: message.chat,
        user: recipientId,
      },
      message
    );
  }

  public notifyChatCreated(chat: ChatModel): void {
    chat.members.forEach((member) => {
      this.eventEmitter.publish(
        { name: ChatCreatedEventName, user: member.id },
        chat
      );
    });
  }

  public notifyUserStatusUpdated(
    chat: ChatModel,
    userId: string,
    status: ChatMemberStatus
  ): void {
    chat.members.forEach((member) => {
      this.eventEmitter.publish(
        {
          name: ChatMemberStatusChangedEventName,
          user: member.id,
          chatId: chat.id,
        },
        { userId, status }
      );
    });
  }

  public notifyChatUpdated(chat: ChatModel): void {
    chat.members.forEach((member) => {
      this.eventEmitter.publish(
        { name: ChatUpdatedEventName, chatId: chat.id, user: member.id },
        chat
      );
    });
  }

  public notifyLeftChat(chat: ChatModel, userId: string): void {
    this.eventEmitter.publish({ name: LeftChatEventName, user: userId }, chat);
  }

  public notifyJoinedChat(chat: ChatModel, userId: string): void {
    this.eventEmitter.publish({ name: JoinChatEventName, user: userId }, chat);
  }
}

const chatServer = new ChatServer();
export default chatServer;
