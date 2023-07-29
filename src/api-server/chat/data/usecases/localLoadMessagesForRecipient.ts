/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  ChatContextUser,
  ChatMessagesContext,
} from 'api-server/chat/domain/models/chatContext';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { ILocalBrainRepository } from 'data/brain/localBrainRepository';
import { ICurrentUserService } from 'api-server/user/models/currentUserService';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';

export default class LocalLoadMessagesForRecipient
  implements LoadMessageForRecipient
{
  constructor(
    private readonly messageRepository: IChatMessageRepository,
    private readonly brainRepository: ILocalBrainRepository,
    private readonly currentUserService: ICurrentUserService
  ) {}

  async loadMessages(
    params: LoadMessageForRecipient.Params
  ): Promise<LoadMessageForRecipient.Model[]> {
    const { recipientId, messageStatus, chatId } = params;

    const messages = await this.messageRepository.getAll({
      to: recipientId,
      status: messageStatus,
      chatId,
    });

    const model: LoadMessageForRecipient.Model[] = [];

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

    const currentUser = await this.currentUserService.get();
    const users: Record<string, ChatContextUser> = {};

    for (const chat in groupedMessages) {
      const chatMessages = groupedMessages[chat];
      const localUsers: Record<string, ChatContextUser> = {};

      // Horrible code, but it works and I don't have time to refactor it
      for (const msg of chatMessages) {
        if (!users[msg.senderId]) {
          if (msg.senderId === currentUser.id) {
            // TODO: Refactor this to get profile from user repository
            users[msg.senderId] = {
              name: currentUser.profile.name ?? 'You',
              avatar: currentUser.profile.avatar,
            };
          } else {
            const brain = await this.brainRepository.getBrain(msg.senderId);
            if (brain) {
              users[msg.senderId] = {
                name: brain.displayName,
                avatar: '',
              };
            } else {
              users[msg.senderId] = {
                name: 'Unknown',
                avatar: '',
              };
            }
          }
        }

        if (!localUsers[msg.senderId]) {
          localUsers[msg.senderId] = users[msg.senderId];
        }
      }

      model.push(new ChatMessagesContext(chatMessages, localUsers));
    }

    return model;
  }
}
