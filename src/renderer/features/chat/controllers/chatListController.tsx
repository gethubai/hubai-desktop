import React from 'react';
import {
  type IActivityBarService,
  type IEditorService,
  type ISidebarService,
  react,
  type IActivityBarItem,
  type IColorThemeService,
  IColors,
  Controller,
} from '@hubai/core';
import { container } from 'tsyringe';

import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { ILocalUserService } from 'renderer/features/user/services/userService';
import {
  ChatMemberType,
  ChatModel,
  ChatUser,
} from 'api-server/chat/domain/models/chat';
import { IDisposable } from '@hubai/core/esm/monaco';
import { getThemeData } from 'mo/services/theme/helper';
import { ChatTreeItemProps } from 'renderer/components/chatTree';

import { ChatListService } from '../services/chatListService';
import { IChatListController } from './type';
import { ChatListFilters, IChatClient } from '../sdk/contracts';
import ChatListSidebar from '../workbench/chatList/chatListSidebar';
import { IChatItem } from '../models/chat';
import ChatWindowController from './chatWindowController';
import { ChatWindowService } from '../services/chatWindowService';
import ChatView from '../workbench/chatView';

const { connect } = react;

export type ChatListSettings = {
  chatMemberId?: string;
  onlyDirectMessages?: boolean;
  onlyGroupMessages?: boolean;
  createChatFactory?: () => CreateChat.Params;
  isDefaultSidebar?: boolean;
  mapChatItem?: (chat: IChatItem) => Omit<ChatTreeItemProps, 'id'>;
};

export default class ChatListController
  extends Controller
  implements IChatListController
{
  private readonly sideBarService: ISidebarService;

  private readonly activityBarService: IActivityBarService;

  private readonly chatClient: IChatClient;

  private readonly chatListService: ChatListService;

  private readonly localUserService: ILocalUserService;

  private readonly editorService: IEditorService;

  private readonly themeService: IColorThemeService;

  private static chatColors: IColors;

  constructor(
    private readonly listSettings: ChatListSettings,
    private readonly activityBarItem: IActivityBarItem
  ) {
    super();

    this.sideBarService = container.resolve('ISidebarService');
    this.activityBarService = container.resolve('IActivityBarService');
    this.chatClient = container.resolve('IChatClient');
    this.localUserService = container.resolve('ILocalUserService');
    this.editorService = container.resolve('IEditorService');
    this.themeService = container.resolve('IColorThemeService');

    this.setChatColors();
    this.chatListService = new ChatListService(
      this.activityBarItem.title ?? 'Chat List'
    );
  }

  initView(): void {
    const ChatListSidebarView = connect(
      this.chatListService,
      ChatListSidebar,
      this
    );

    const chatListSidebar = {
      id: this.activityBarItem.id,
      title: this.activityBarItem.title,
      render: () => (
        <ChatListSidebarView mapChatItem={this.listSettings?.mapChatItem} />
      ),
    };

    const chatListSideBarHeaderToolbar = [
      {
        icon: 'add',
        id: 'chatListAddChat',
        title: 'Add Chat',
        onClick: () => this.openNewChatWindow(),
      },
    ];

    this.sideBarService.add(
      chatListSidebar,
      this.listSettings.isDefaultSidebar
    );
    this.activityBarService.add(
      this.activityBarItem,
      this.listSettings.isDefaultSidebar
    );

    this.chatListService.setState({
      headerToolBar: chatListSideBarHeaderToolbar,
    });

    this.refreshChatList();
    this.addChatEventSubscriptions();
  }

  isChatFromThisList(chat: ChatModel): boolean {
    // Check if the chat match the parameters
    if (
      this.listSettings.chatMemberId &&
      !chat.members.some((m) => m.id === this.listSettings.chatMemberId)
    )
      return false;

    if (this.listSettings.onlyDirectMessages && !chat.isDirect) return false;

    if (this.listSettings.onlyGroupMessages && chat.isDirect) return false;

    return true;
  }

  async refreshChatList(): Promise<void> {
    const params: ChatListFilters = {};

    if (this.listSettings.chatMemberId) {
      params.userId = this.listSettings.chatMemberId;
    }

    if (this.listSettings.onlyDirectMessages) {
      params.isDirect = true;
    }

    if (this.listSettings.onlyGroupMessages) {
      params.isDirect = false;
    }

    const chats = await this.chatClient.chats(params);
    this.chatListService.setChats(chats);
  }

  private async openNewChatWindow(): Promise<void> {
    if (!this.listSettings.createChatFactory) {
      throw new Error('createChatFactory must be defined to create a chat');
    }

    const user = this.localUserService.getUser();

    // TODO: Get default brains from settings
    const createOptions: CreateChat.Params = {
      ...this.listSettings.createChatFactory?.(),
      initiator: user.id,
    };

    const currentMemberIndex = createOptions.members.findIndex(
      (m) => m.id === user.id
    );
    if (currentMemberIndex === -1)
      createOptions.members.push({
        id: user.id,
        memberType: ChatMemberType.user,
      } as ChatUser);

    const result = await this.chatClient.newChat(createOptions);

    if (result) {
      this.selectOrOpenChatWindow(this.chatListService.parseChat(result));
    } else {
      // TODO: Show error message
      console.error('Failed to create chat');
    }
  }

  private async selectOrOpenChatWindow(chat: IChatItem): Promise<void> {
    let renderPane;
    let disposables: IDisposable[];
    if (!this.editorService.isOpened(chat.id)) {
      const chatInstance = await this.chatClient.chat(chat.id.toString());

      const { Component, service, controller } =
        this.createChatWindow(chatInstance);
      renderPane = () => (
        <Component
          key={chat.id}
          getCurrentThemeColors={() => ChatListController.chatColors}
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

  addChatEventSubscriptions(): void {
    this.chatClient.onChatCreated((chat) => {
      if (!this.isChatFromThisList(chat)) return;
      this.refreshChatList();
    });

    this.chatClient.onChatUpdated((chat) => {
      if (
        this.chatListService
          .getState()
          .chats.findIndex((v) => v.id === chat.id) === -1
      )
        return;

      this.refreshChatList();
    });
  }

  public onChatClick = (item: IChatItem) => {
    this.selectOrOpenChatWindow(item);
  };

  private setChatColors(): void {
    if (ChatListController.chatColors) return;
    ChatListController.chatColors = {};

    const theme = getThemeData(this.themeService.getColorTheme());
    Object.keys(theme.colors).forEach((key: string) => {
      if (key.startsWith('chat')) {
        ChatListController.chatColors[key] = theme.colors[key];
      }
    });
  }
}
