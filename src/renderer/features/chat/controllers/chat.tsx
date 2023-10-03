import React from 'react';
import { react, type IActivityBarItem, IColors } from '@hubai/core';
import { Icon } from '@hubai/core/esm/components';
import { injectable, inject } from 'tsyringe';
import { ChatUser, ChatMemberType } from 'api-server/chat/domain/models/chat';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import { IChatController } from './type';
import ChatListController from './chatListController';

const { Controller } = react;

@injectable()
export default class ChatController
  extends Controller
  implements IChatController
{
  chatColors!: IColors;

  constructor(
    @inject('ILocalUserService') private localUserService: ILocalUserService
  ) {
    super();
  }

  public initView(): void {
    const { id } = this.localUserService.getUser();
    const controller = new ChatListController(
      {
        chatMemberId: id,
        onlyGroupMessages: true,
        createChatFactory: () => ({
          name: 'Group Chat',
          initiator: id,
          members: [
            {
              id,
              memberType: ChatMemberType.user,
            } as ChatUser,
          ],
          isDirect: false,
        }),
      },
      {
        id: 'chatList.groups',
        name: 'Group Chats',
        title: 'Group Chats',
        type: 'chat',
        render: () => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Icon type="comment" />
            <span style={{ fontSize: 13 }}>Groups</span>
          </div>
        ),
        sortIndex: -1,
      } as IActivityBarItem
    );

    controller.initView();
  }
}
