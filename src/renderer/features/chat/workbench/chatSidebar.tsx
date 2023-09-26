import { Content, Header } from '@hubai/core/esm/workbench';
import { Toolbar } from '@hubai/core/esm/components';
import { ChatTree } from 'renderer/components/chatTree';
import { IChatController } from '../controllers/type';
import { IChatState } from '../models/chat';

export interface IChatSidebarProps extends IChatController, IChatState {}

function ChatSidebar({ headerToolBar, chats, onChatClick }: IChatSidebarProps) {
  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title="AI Chats"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <ChatTree
          data={
            chats.map((chat) => ({
              id: chat.id,
              displayName: chat.displayName,
              shortDescription: chat.lastActivity
                ? `${chat.lastActivity.senderName}: ${chat.lastActivity.text}`
                : '',
              footerText: chat.lastActivity?.date ?? chat.createdDate,
              disabled: false,
              avatars: chat.avatars,
              onClick: () => {
                onChatClick?.(chat);
              },
            })) as any
          }
        />
      </Content>
    </div>
  );
}

export default ChatSidebar;
