import React, { useMemo } from 'react';
import { Content, Header } from '@hubai/core';
import { ChatTree, ChatTreeItemProps } from 'renderer/components/chatTree';
import { Toolbar } from '@hubai/core/esm/components';
import { IChatListController } from '../../controllers/type';
import { IChatListState } from '../../services/chatListService';
import { IChatItem } from '../../models/chat';

export interface IChatListSidebarProps
  extends IChatListController,
    IChatListState {
  mapChatItem?: (chat: IChatItem) => Omit<ChatTreeItemProps, 'id'>;
}

function ChatListSidebar({
  headerToolBar,
  chats,
  onChatClick,
  title,
  mapChatItem,
}: IChatListSidebarProps) {
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
        ...{ ...mapChatItem?.(chat) },
      })) as any,
    [chats, mapChatItem, onChatClick]
  );

  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title={title ?? 'Chat List'}
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <ChatTree data={data} />
      </Content>
    </div>
  );
}

export default ChatListSidebar;
