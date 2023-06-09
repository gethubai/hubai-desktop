import 'reflect-metadata';
import { container } from 'tsyringe';
import { connect } from 'mo/react';
import { StatusBarService } from 'mo/services';
import { StatusBarController } from 'mo/controller/statusBar';
import { StatusBar } from './statusBar';

export * from './statusBar';
export * from './item';

const statusBarService = container.resolve(StatusBarService);
const statusBarController = container.resolve(StatusBarController);

export const StatusBarView = connect(
  statusBarService,
  StatusBar,
  statusBarController
);
