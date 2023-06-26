import { container } from 'tsyringe';
import { Controller, connect } from '@allai/core/esm/react';

import { IMenuBarService } from '@allai/core';
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
