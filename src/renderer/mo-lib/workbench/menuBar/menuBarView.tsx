import { container } from 'tsyringe';
import { Controller, connect } from '@hubai/core/esm/react';

import { IMenuBarService } from '@hubai/core';
import { IMenuBarController } from 'mo/controllers';
import MenuBar from './menuBar';

const menuBarService = container.resolve<IMenuBarService>('IMenuBarService');
const menuBarController =
  container.resolve<IMenuBarController>('IMenuBarController');

const MenuBarView = connect(
  menuBarService,
  MenuBar,
  menuBarController as Controller
);

export { MenuBar, MenuBarView };
