import React from 'react';
import molecule from 'mo';
import { Header, Content } from 'mo/workbench/sidebar';
import {
  type IActionBarItemProps,
  type ITreeNodeItemProps,
} from 'mo/components';
import { type ICollapseItem } from 'mo/components/collapse';
import { localize } from 'mo/i18n/localize';

import API from '../api';
import DataSourceDetail from './components/detail';
import { openCreateDataSourceView } from '../base';

const Tree = molecule.component.TreeView;
const { Toolbar } = molecule.component;
const { Collapse } = molecule.component;
export class DataSourceSidebarView extends React.Component {
  state = {
    data: [],
    currentDataSource: undefined,
  };

  componentDidMount() {
    this.fetchData();
    molecule.event.EventBus.subscribe('addDataSource', () => {
      this.reload();
    });
  }

  async fetchData() {
    const res = await API.getDataSource();
    if (res.message === 'success') {
      this.setState({
        data: res.data.children || [],
      });
    }
  }

  fetchDataSource = async (id: string) => {
    const dataSource = await API.getDataSourceById(id);
    this.setState({ currentDataSource: dataSource });
  };

  reload() {
    this.fetchData();
  }

  create() {
    openCreateDataSourceView();
  }

  selectedSource = (node: ITreeNodeItemProps) => {
    if (node.isLeaf) {
      this.fetchDataSource(node.id as string);
    }
  };

  renderHeaderToolbar(): IActionBarItemProps[] {
    return [
      {
        icon: 'refresh',
        id: 'reload',
        title: 'Reload',
        onClick: () => this.reload(),
      },
      {
        icon: 'add',
        id: 'addDataSource',
        title: 'Create Data Source',
        onClick: () => this.create(),
      },
    ];
  }

  renderCollapse(): ICollapseItem[] {
    const dataSource: DataSourceChatType | undefined =
      this.state.currentDataSource;
    return [
      {
        id: 'DataSourceList',
        name: 'Active Chats',
        renderPanel: () => {
          return <Tree data={this.state.data} onSelect={this.selectedSource} />;
        },
      },
      {
        id: 'DataSourceDetail',
        name: 'Detail',
        renderPanel: () => {
          return <DataSourceDetail dataSource={dataSource} />;
        },
      },
    ];
  }

  render() {
    return (
      <div className="dataSource" style={{ width: '100%', height: '100%' }}>
        <Header
          title={localize('demo.dataSourceManagement', 'Chats')}
          toolbar={<Toolbar data={this.renderHeaderToolbar()} />}
        />
        <Content>
          <Collapse data={this.renderCollapse()} />
        </Content>
      </div>
    );
  }
}

export default DataSourceSidebarView;
