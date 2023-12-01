import { AppContext, IExtension } from '@hubai/core';
import ShortcutRegisterService from './services/shortcutRegisterService';
import { ShortcutRegisterController } from './controllers/shortcutRegisterController';
import { connect } from '@hubai/core/esm/react';
import Sidebar from './views/sidebar';

export class ShortcutRegister implements IExtension {
  id = 'shortcutRegister';
  name = 'Shortcut Register';

  activate(context: AppContext): void {
    const service = new ShortcutRegisterService();

    const controller = new ShortcutRegisterController(context, service);
    controller.initView();

    const SidebarViewConnected = connect(service, Sidebar, controller);

    const sidebar = {
      id: 'shortcutRegister.sidebarPane',
      title: 'SidebarPanel',
      render: () => <SidebarViewConnected />,
    };

    const activityBar = {
      id: 'shortcutRegister.sidebarPane',
      name: 'ShortcutRegister',
      title: 'Shortcuts - Register new shortcuts for interacting with AIs',
      icon: 'record-keys',
    };

    context.services.sidebar.add(sidebar);
    context.services.activityBar.add(activityBar);
  }

  dispose(context: AppContext): void {
    context.services.sidebar.remove('shortcutRegister.sidebarPane');
    context.services.activityBar.remove('shortcutRegister.sidebarPane');
  }
}

const shortcutRegister = new ShortcutRegister();
export default shortcutRegister;
