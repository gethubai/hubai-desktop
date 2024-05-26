import { AppContext, IExtension, react } from '@hubai/core';
import { PackageStoreController } from './controllers/packageStoreController';
import PackageStoreService from './services/packageStoreService';
import SidebarView from './views/sidebar';
import './views/styles.scss';

const { connect } = react;

export class PackageStoreExtension implements IExtension {
  id = 'packageStore';

  name = 'PackageStore';

  activate(context: AppContext): void {
    const service = new PackageStoreService();

    const controller = new PackageStoreController(context, service);

    const SidebarViewConnected = connect(service, SidebarView, controller);

    controller.initView();

    const sidebar = {
      id: 'packageStore.sidebarPane',
      title: 'SidebarPanel',
      render: () => <SidebarViewConnected />,
    };

    const activityBar = {
      id: 'packageStore.sidebarPane',
      name: 'PackageStore',
      title: 'Package Store - Download new brains and extensions',
      icon: 'cloud-download',
    };

    context.services.sidebar.add(sidebar);
    context.services.activityBar.add(activityBar);
  }

  dispose(context: AppContext): void {
    context.services.sidebar.remove('packageStore.sidebarPane');
    context.services.activityBar.remove('packageStore.sidebarPane');
  }
}

const packageStoreExtension = new PackageStoreExtension();
export default packageStoreExtension;
