import { Content, Header } from 'mo/workbench/sidebar';
import { Toolbar, Collapse } from 'mo/components';
import { ICollapseItem } from 'mo/components/collapse';
import Tree from 'mo/components/tree';
import { IBrainController } from '../controllers/type';
import { BrainViewModel, IBrainState } from '../models/brain';

export interface IBrainSidebarProps extends IBrainController, IBrainState {}

function BrainSidebar({
  headerToolBar,
  brains,
  onBrainClick,
}: IBrainSidebarProps) {
  const collapseItems = brains?.map(
    (brain) =>
      ({
        id: brain.id,
        name: brain.name,
        fileType: 'File',
        icon: 'bold',
        isLeaf: true,
        capabilities: brain.capabilities,
      } as ICollapseItem)
  );

  const renderCollapse = (): ICollapseItem[] => {
    return [
      {
        id: 'BrainList',
        name: 'Brains',
        renderPanel: () => {
          return (
            <Tree
              data={collapseItems}
              onSelect={(node) => {
                if (!node.isLeaf) return;
                onBrainClick?.({
                  id: node.id,
                  name: node.name,
                  capabilities: node.capabilities,
                } as BrainViewModel);
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
        title="Installed Brains (IA)"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <Collapse data={renderCollapse()} activePanelKeys={['BrainList']} />
      </Content>
    </div>
  );
}

export default BrainSidebar;
