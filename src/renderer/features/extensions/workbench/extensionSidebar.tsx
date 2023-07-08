import { ICollapseItem } from '@hubai/core/esm/components/collapse';
import Tree from '@hubai/core/esm/components/tree';
import { Content, Header } from '@hubai/core/esm/workbench';
import { Toolbar, Collapse } from '@hubai/core/esm/components';
import { IExtensionListController } from '../controllers/type';
import {
  LocalExtensionViewModel,
  IExtensionListState,
} from '../models/extension';

export interface IExtensionSidebarProps
  extends IExtensionListController,
    IExtensionListState {}

function ExtensionSidebar({
  headerToolBar,
  extensions,
  onExtensionClick,
}: IExtensionSidebarProps) {
  const collapseItems = extensions?.map(
    (extension) =>
      ({
        id: extension.id,
        name: extension.displayName,
        fileType: 'File',
        icon: 'project',
        isLeaf: true,
        extension,
      } as ICollapseItem)
  );

  const renderCollapse = (): ICollapseItem[] => {
    return [
      {
        id: 'ExtensionList',
        name: 'Extensions',
        renderPanel: () => {
          return (
            <Tree
              data={collapseItems}
              onSelect={(node) => {
                if (!node.isLeaf) return;
                onExtensionClick?.(node.extension as LocalExtensionViewModel);
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
        title="Installed Extensions"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <Collapse data={renderCollapse()} activePanelKeys={['ExtensionList']} />
      </Content>
    </div>
  );
}

export default ExtensionSidebar;
