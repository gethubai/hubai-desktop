import 'reflect-metadata';
import { connect } from 'mo/react';

import { MenuBarService } from 'mo/services';
import { container } from 'tsyringe';
import { MenuBarController } from 'mo/controller/menuBar';
import MenuBar from './menuBar';

const menuBarService = container.resolve(MenuBarService);
const menuBarController = container.resolve(MenuBarController);

const MenuBarView = connect(menuBarService, MenuBar, menuBarController);

export { MenuBar, MenuBarView };
