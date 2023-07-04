import React from 'react';
import { Collapse, ICollapseItem } from '@hubai/core/esm/components/collapse';
import Tree from '@hubai/core/esm/components/tree';
import { Content, Header } from '@hubai/core/esm/workbench';
import { Toolbar } from '@hubai/core/esm/components';
import { IChatController } from '../controllers/type';
import { IChatItem, IChatState } from '../models/chat';

export interface IChatSidebarProps extends IChatController, IChatState {}

function ChatSidebar({
  headerToolBar,
  groups,
  onChatClick,
}: IChatSidebarProps) {
  const collapseItems = groups?.map(
    (group) =>
      ({
        id: group.id,
        name: group.name,
        fileType: 'Folder',
        icon: 'comment',
        children: group.items?.map((item) => ({
          id: item.id,
          name: item.name,
          icon: 'comment-discussion',
          fileType: 'File',
          isLeaf: true,
        })),
      } as ICollapseItem)
  );

  const renderCollapse = (): ICollapseItem[] => {
    return [
      {
        id: 'ChatGroupsList',
        name: 'Active Chats',
        renderPanel: () => {
          return (
            <Tree
              data={collapseItems}
              onSelect={(node) => {
                if (!node.isLeaf) return;
                onChatClick?.({ id: node.id, name: node.name } as IChatItem);
              }}
            />
          );
        },
      },
    ];
  };

  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title="AI Chats"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <Collapse
          data={renderCollapse()}
          activePanelKeys={['ChatGroupsList']}
        />
      </Content>
    </div>
  );
}

export default ChatSidebar;
