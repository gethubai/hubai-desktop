import { ICollapseItem } from '@allai/core/esm/components/collapse';
import Tree from '@allai/core/esm/components/tree';
import { Content, Header } from '@allai/core/esm/workbench/sidebar';
import { Toolbar, Collapse } from '@allai/core/esm/components';
import { IBrainController } from '../controllers/type';
import { LocalBrainViewModel, IBrainState } from '../models/brain';

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
        name: brain.title,
        fileType: 'File',
        icon: 'bold',
        isLeaf: true,
        brain,
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
                onBrainClick?.(node.brain as LocalBrainViewModel);
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
