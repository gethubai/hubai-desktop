import {
  type IActivityBarItem,
  type IEditorTab,
  type ISidebarPane,
  type IMenuBarItem,
} from 'mo/model';
import molecule from 'mo';
import { localize } from 'mo/i18n/localize';
import DataSourceView from './views/dataSourceSidebar';
import CreateDataSourceView from './views/createDataSource';

export const DATA_SOURCE_ID = 'Chat';

export const dataSourceActivityBar: IActivityBarItem = {
  id: DATA_SOURCE_ID,
  sortIndex: -1,
  name: 'AI Chats',
  title: 'Active Chats',
  icon: 'comment',
};

export const dataSourceSidebar: ISidebarPane = {
  id: DATA_SOURCE_ID,
  title: 'DataSourcePane',
  render: () => {
    return <DataSourceView />;
  },
};

export const createDataSourceTab: IEditorTab = {
  id: DATA_SOURCE_ID,
  name: 'Chat 1',
  renderPane: () => {
    return <CreateDataSourceView />;
  },
};

export const createDataSourceMenuItem: IMenuBarItem = {
  id: 'menu.createDataSource',
  name: localize('menu.createDataSource', 'Chat'),
  icon: '',
};

export function openCreateDataSourceView() {
  molecule.editor.open(createDataSourceTab);
}

export function existCreateDataSourceView() {
  const group = molecule.editor.getState().current;
  if (group) {
    molecule.editor.closeTab(createDataSourceTab.id!, group.id!);
  }
}
