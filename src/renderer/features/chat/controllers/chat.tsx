import React from 'react';
import { Controller } from 'mo/react/controller';
import { connect } from 'mo/react';
import {
  ActivityBarService,
  BuiltinService,
  EditorService,
  IActivityBarService,
  IBuiltinService,
  IEditorService,
  ISidebarService,
  SidebarService,
} from 'mo/services';
import { container, singleton } from 'tsyringe';
import { IActivityBarItem } from 'mo/model';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import {
  BrainManagementService,
  IBrainManagementService,
} from 'renderer/features/brain/services/brainManagement';
import { ChatService, IChatService } from '../services/chat';
import ChatSidebar from '../workbench/chatSidebar';
import { IChatController } from './type';
import { IChatItem } from '../models/chat';
import ChatView from '../workbench/chatView';
import { ChatWindowService } from '../services/chatWindowService';
import ChatWindowController from './chatWindowController';

@singleton()
export default class ChatController
  extends Controller
  implements IChatController
{
  private readonly sideBarService: ISidebarService;

  private readonly activityBarService: IActivityBarService;

  private readonly chatService: IChatService;

  private readonly builtinService: IBuiltinService;

  private readonly editorService: IEditorService;

  private readonly brainService: IBrainManagementService;

  constructor() {
    super();

    this.sideBarService = container.resolve(SidebarService);
    this.activityBarService = container.resolve(ActivityBarService);
    this.chatService = container.resolve(ChatService);
    this.builtinService = container.resolve(BuiltinService);
    this.editorService = container.resolve(EditorService);
    this.brainService = container.resolve(BrainManagementService);
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
    const createOptions: CreateChat.Params = {
      name: `New chat ${index}`,
      initiator: `Fake Extensions`,
      brains: [
        { id: 'brainIdTest', handleMessageType: 'text' },
        { id: 'brainIdTest', handleMessageType: 'voice' },
      ],
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
    const controller = new ChatWindowController(service, chat);
    controller.initView();

    return connect(service, ChatView, controller);
  }

  public onChatClick = (item: IChatItem) => {
    this.selectOrOpenChatWindow(item as ChatModel);
  };
}
