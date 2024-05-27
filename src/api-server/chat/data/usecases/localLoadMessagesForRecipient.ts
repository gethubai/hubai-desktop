import {
  ChatContextUser,
  ChatMessagesContext,
} from 'api-server/chat/domain/models/chatContext';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { GetUserProfile } from 'api-server/chat/domain/usecases/getUserProfile';
import { IChatRepository } from 'data/chat/chatRepository';
import {
  LoadMessageForRecipientParams,
  LoadMessageForRecipientModel,
  LoadMessageForRecipient,
} from '../../domain/usecases/loadMessagesForRecipient';

export default class LocalLoadMessagesForRecipient
  implements LoadMessageForRecipient
{
  constructor(
    private readonly messageRepository: IChatMessageRepository,
    private readonly chatRepository: IChatRepository,
    private readonly getUserProfile: GetUserProfile
  ) {}

  async loadMessages(
    params: LoadMessageForRecipientParams
  ): Promise<LoadMessageForRecipientModel[]> {
    const { recipientId, messageStatus, chatId } = params;

    const messages = await this.messageRepository.getAll({
      to: recipientId,
      status: messageStatus,
      chatId,
    });

    const model: LoadMessageForRecipientModel[] = [];

    // group by chat
    const groupedMessages: { [chat: string]: ChatMessageModel[] } =
      messages.reduce((acc: Record<string, ChatMessageModel[]>, message) => {
        const { chat } = message;
        if (!acc[chat]) {
          acc[chat] = [];
        }
        acc[chat].push(message);
        return acc;
      }, {});

    const users: Record<string, ChatContextUser> = {};

    if (groupedMessages) {
      Object.keys(groupedMessages).forEach(async (chat) => {
        const chatMessages = groupedMessages[chat];
        const chatModel = await this.chatRepository.get(chat);
        const localUsers: Record<string, ChatContextUser> = {};

        const loadUser = async (userId: string) => {
          if (!users[userId]) {
            const profile = await this.getUserProfile.profile({
              userId,
            });
            users[userId] = { ...profile, id: userId };
          }

          if (!localUsers[userId]) {
            localUsers[userId] = users[userId];
          }
        };

        chatMessages.forEach(async (msg) => {
          await loadUser(msg.senderId);
        });

        if (chatModel) {
          chatModel.members.forEach(async (member) => {
            await loadUser(member.id);
          });
        }

        model.push(new ChatMessagesContext(chatMessages, localUsers));
      });
    }

    return model;
  }
}
