import React from 'react';
import {
  type IActivityBarService,
  type IEditorService,
  type ISidebarService,
  react,
  type IActivityBarItem,
  type IColorThemeService,
  IColors,
} from '@hubai/core';

import { injectable, inject } from 'tsyringe';
import {
  ChatUser,
  ChatMemberType,
  ChatModel,
} from 'api-server/chat/domain/models/chat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import type { IBuiltinService } from 'mo/services/builtinService';
import { getThemeData } from 'mo/services/theme/helper';
import { IDisposable } from '@hubai/core/esm/monaco/common';
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
  chatColors!: IColors;

  constructor(
    @inject('IChatService') private chatService: IChatService,
    @inject('ISidebarService') private sideBarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IEditorService') private editorService: IEditorService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('ILocalUserService') private localUserService: ILocalUserService,
    @inject('IBrainManagementService')
    private brainService: IBrainManagementService,
    @inject('IColorThemeService')
    private readonly themeService: IColorThemeService
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
    });
    this.sideBarService.add(chatGroupSideBar, true);
    this.activityBarService.add(activityBar, true);
    this.setChatColors();
    this.themeService.onChange(() => this.setChatColors());
  }

  private setChatColors(): void {
    this.chatColors = {};
    const theme = getThemeData(this.themeService.getColorTheme());
    Object.keys(theme.colors).forEach((key: string) => {
      if (key.startsWith('chat')) {
        this.chatColors[key] = theme.colors[key];
      }
    });
  }

  private async openNewChatWindow(): Promise<void> {
    const index = this.chatService.getChatCount() + 1;

    const user = this.localUserService.getUser();

    // TODO: Get default brains from settings
    const createOptions: CreateChat.Params = {
      name: `New chat ${index}`,
      initiator: user.id,
      members: [{ id: user.id, memberType: ChatMemberType.user } as ChatUser],
    };

    const result = await this.chatService.createChat(createOptions);
    if (result) {
      this.selectOrOpenChatWindow(this.chatService.parseChat(result));
    } else {
      // TODO: Show error message
      console.error('Failed to create chat');
    }
  }

  private async selectOrOpenChatWindow(chat: IChatItem): Promise<void> {
    let renderPane;
    let disposables: IDisposable[];
    if (!this.editorService.isOpened(chat.id)) {
      const chatInstance = await this.chatService.getChat(chat.id as any);
      const { Component, service, controller } =
        this.createChatWindow(chatInstance);
      renderPane = () => (
        <Component
          key={chat.id}
          getCurrentThemeColors={() => this.chatColors}
        />
      );
      disposables = [service, controller];
    }
    this.editorService.open({
      id: chat.id,
      name: chat.displayName,
      icon: 'comment',
      renderPane,
      disposables,
    });
  }

  private createChatWindow(chat: ChatModel): {
    Component: React.ComponentType<any>;
    controller: ChatWindowController;
    service: ChatWindowService;
  } {
    const service = new ChatWindowService(chat);
    const controller = new ChatWindowController(
      service,
      chat,
      this.localUserService
    );
    controller.initView();

    return {
      Component: connect(service, ChatView, controller),
      controller,
      service,
    };
  }

  public onChatClick = (item: IChatItem) => {
    this.selectOrOpenChatWindow(item);
  };
}
