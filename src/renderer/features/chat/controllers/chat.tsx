import React from 'react';
import {
  type IActivityBarService,
  type IEditorService,
  type ISidebarService,
  react,
  type IActivityBarItem,
} from '@hubai/core';

import { injectable, inject } from 'tsyringe';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import type { IBuiltinService } from 'mo/services/builtinService';
import ChatSidebar from '../workbench/chatSidebar';
import { IChatController } from './type';
import { IChatItem } from '../models/chat';
import ChatView from '../workbench/chatView';
import { ChatWindowService } from '../services/chatWindowService';
import ChatWindowController from './chatWindowController';
import type { IChatService } from '../services/types';

const { connect, Controller } = react;

@injectable()
export default class ChatController
  extends Controller
  implements IChatController
{
  constructor(
    @inject('IChatService') private chatService: IChatService,
    @inject('ISidebarService') private sideBarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IEditorService') private editorService: IEditorService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('ILocalUserService') private localUserService: ILocalUserService,
    @inject('IBrainManagementService')
    private brainService: IBrainManagementService
  ) {
    super();
  }

  public initView(): void {
    const id = 'CHAT';
    const ChatGroupSideBarView = connect(this.chatService, ChatSidebar, this);

    const activityBar = {
      id,
      name: 'AI Chats',
      title: 'Active Chats',
      icon: 'comment',
      sortIndex: -1,
    } as IActivityBarItem;

    const chatGroupSideBar = {
      id,
      title: 'Chat',
      render() {
        return <ChatGroupSideBarView />;
      },
    };

    const chatSideBarHeaderToolbar = [
      {
        icon: 'add',
        id: 'addChat',
        title: 'Add Chat',
        onClick: () => this.openNewChatWindow(),
      },
    ];

    this.chatService.setState({
      headerToolBar: chatSideBarHeaderToolbar,
      availableBrains: this.brainService.getBrains(),
    });
    this.sideBarService.add(chatGroupSideBar, true);
    this.activityBarService.add(activityBar, true);
  }

  private async openNewChatWindow(): Promise<void> {
    const index = this.chatService.getChatCount() + 1;

    const user = this.localUserService.getUser();

    // TODO: Get default brains from settings
    const createOptions: CreateChat.Params = {
      name: `New chat ${index}`,
      initiator: user.id,
      brains: [],
    };

    const result = await this.chatService.createChat(createOptions);
    if (result) {
      this.selectOrOpenChatWindow(result);
    } else {
      // TODO: Show error message
      console.error('Failed to create chat');
    }
  }

  private async selectOrOpenChatWindow(chat: ChatModel): Promise<void> {
    let renderPane;
    if (!this.editorService.isOpened(chat.id)) {
      const chatInstance = await this.chatService.getChat(chat.id);
      const ChatViewWindow = this.createChatWindow(chatInstance);
      renderPane = () => <ChatViewWindow />;
    }
    this.editorService.open({
      id: chat.id,
      name: chat.name,
      icon: 'comment',
      renderPane,
    });
  }

  private createChatWindow(chat: ChatModel): React.ComponentType<any> {
    const service = new ChatWindowService(chat);
    const controller = new ChatWindowController(
      service,
      chat,
      this.localUserService
    );
    controller.initView();

    return connect(service, ChatView, controller);
  }

  public onChatClick = (item: IChatItem) => {
    this.selectOrOpenChatWindow(item as ChatModel);
  };
}
