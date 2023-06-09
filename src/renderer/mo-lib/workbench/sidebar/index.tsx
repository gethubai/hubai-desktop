import 'reflect-metadata';
import { connect } from 'mo/react';
import { SidebarService } from 'mo/services';
import { container } from 'tsyringe';
import { SidebarController } from 'mo/controller/sidebar';
import { Sidebar } from './sidebar';

export * from './sidebar';

const sidebarService = container.resolve(SidebarService);
const sidebarController = container.resolve(SidebarController);

export const SidebarView = connect(sidebarService, Sidebar, sidebarController);
