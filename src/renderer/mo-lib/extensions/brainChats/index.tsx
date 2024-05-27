/* eslint-disable import/prefer-default-export */
import { AppContext, IExtension } from '@hubai/core';
import { ChatMemberType, ChatUser } from 'api-server/chat/domain/models/chat';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import ChatListController from 'renderer/features/chat/controllers/chatListController';
import { getTextMessageTypeForBrainCapability } from 'renderer/features/chat/utils/messageUtils';
import { container } from 'tsyringe';

export const BrainChats: IExtension = {
  id: 'AddBrainChats',
  name: 'Add brain chats to the activity bar',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async activate(extensionCtx: AppContext) {
    const brainManagement = container.resolve<IBrainManagementService>(
      'IBrainManagementService'
    );

    const brains = await brainManagement.getPackagesAsync();

    brains.forEach((brain) => {
      const controller = new ChatListController(
        {
          chatMemberId: brain.id,
          onlyDirectMessages: true,
          mapChatItem: (chat) => ({
            title: chat.lastActivity?.text ?? 'New chat',
            content: '',
          }),
          createChatFactory: () => ({
            name: brain.displayName,
            initiator: brain.id,
            members: [
              {
                id: brain.id,
                memberType: ChatMemberType.brain,
                handleMessageTypes: brain.capabilities.map(
                  getTextMessageTypeForBrainCapability
                ),
              } as ChatUser,
            ],
            isDirect: true,
          }),
          allowAssistants: true,
        },
        {
          id: `brain-${brain.id}`,
          name: brain.displayName,
          title: `${brain.displayName} Chats`,
          // is 'normal' correct? was 'chat' before
          type: 'normal',
          render: () => (
            <img
              style={{ padding: 5, borderRadius: 10 }}
              src={brain.iconUrl ?? 'https://via.placeholder.com/100'}
              alt={brain.displayName}
            />
          ),
        }
      );

      controller.initView();
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
};
