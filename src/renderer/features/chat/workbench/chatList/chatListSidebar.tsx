import React, { useMemo, useCallback } from 'react';
import {
  Content,
  Header,
  component,
  localize,
  getEventPosition,
} from '@hubai/core';
import { ChatTree, ChatTreeItemProps } from 'renderer/components/chatTree';
import {
  Button,
  Icon,
  Menu,
  Toolbar,
  useContextViewEle,
} from '@hubai/core/esm/components';
import { IChatListController } from '../../controllers/type';
import { IChatListState } from '../../services/chatListService';
import { IChatItem } from '../../models/chat';

export interface IChatListSidebarProps
  extends IChatListController,
    IChatListState {
  onNewChatClick?: () => void;
  mapChatItem?: (chat: IChatItem) => Omit<ChatTreeItemProps, 'id'>;
}

function ChatListSidebar({
  headerToolBar,
  chats,
  onChatClick,
  title,
  mapChatItem,
  onContextMenuClick,
  onNewChatClick,
}: IChatListSidebarProps) {
  const contextView = useContextViewEle();

  const openContextMenu = useCallback(
    (e: React.MouseEvent, chat: IChatItem) => {
      e.preventDefault();
      contextView?.show(getEventPosition(e), () => (
        <Menu
          role="menu"
          onClick={(_: any, item: component.IMenuItemProps) => {
            contextView?.hide();
            onContextMenuClick?.(item.id as any, chat);
          }}
          data={[
            {
              id: 'delete',
              name: localize('chatList.delete', 'Delete'),
              icon: 'x',
            },
          ]}
        />
      ));
    },
    [contextView, onContextMenuClick]
  );

  const data = useMemo(
    () =>
      chats.map((chat) => ({
        id: chat.id,
        title: chat.displayName,
        content: chat.lastActivity
          ? `${chat.lastActivity.senderName}: ${chat.lastActivity.text}`
          : '',
        footerText: chat.lastActivity?.date ?? chat.createdDate,
        disabled: false,
        avatars: chat.avatars,
        onClick: () => {
          onChatClick?.(chat);
        },
        onRightClick: (e: React.MouseEvent) => {
          openContextMenu(e, chat);
        },
        ...{ ...mapChatItem?.(chat) },
      })) as any,
    [chats, mapChatItem, onChatClick, openContextMenu]
  );

  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title={title ?? 'Chats'}
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <Button onClick={onNewChatClick}>
          <Icon type="add" style={{ marginRight: 5 }} />
           New Chat
        </Button>
        <ChatTree data={data} />
      </Content>
    </div>
  );
}

export default ChatListSidebar;
