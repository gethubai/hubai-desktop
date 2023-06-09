import { type IActivityBarItem, type IEditorTab, type ISidebarPane, type IMenuBarItem } from 'mo/model';
import DataSourceView from './views/dataSourceSidebar';
import CreateDataSourceView from './views/createDataSource';
import molecule from 'mo';
import { localize } from 'mo/i18n/localize';

export const DATA_SOURCE_ID = 'DataSource';

export const dataSourceActivityBar: IActivityBarItem = {
    id: DATA_SOURCE_ID,
    sortIndex: -1, // sorting the dataSource to the first position
    name: 'Data Source',
    title: 'Data Source Management',
    icon: 'database'
}

export const dataSourceSidebar: ISidebarPane = {
    id: DATA_SOURCE_ID,
    title: 'DataSourcePane',
    render: () => {
        return <DataSourceView />;
    }
}

export const createDataSourceTab: IEditorTab = {
    id: DATA_SOURCE_ID,
    name: 'Create Data Source',
    renderPane: () => {
        return <CreateDataSourceView />;
    }
}

export const createDataSourceMenuItem: IMenuBarItem = {
    id: 'menu.createDataSource',
    name: localize('menu.createDataSource', 'Create Data Source'),
    icon: ''
}

export function openCreateDataSourceView() {
    molecule.editor.open(createDataSourceTab);
}

export function existCreateDataSourceView() {
    const group = molecule.editor.getState().current;
    if (group) {
        molecule.editor.closeTab(createDataSourceTab.id!, group.id!);
    }
}