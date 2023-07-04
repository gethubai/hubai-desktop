import { container } from 'tsyringe';
import { IStatusBarService } from '@hubai/core';
import { IStatusBarController } from '@hubai/core/esm/controller';
import { Controller, connect } from '@hubai/core/esm/react';
import StatusBar from './statusBar';

const statusBarService =
  container.resolve<IStatusBarService>('IStatusBarService');
const statusBarController = container.resolve<IStatusBarController>(
  'IStatusBarController'
);

const StatusBarView = connect(
  statusBarService,
  StatusBar,
  statusBarController as Controller
);

export default StatusBarView;
