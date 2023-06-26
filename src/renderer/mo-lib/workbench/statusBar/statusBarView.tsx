import { container } from 'tsyringe';
import { IStatusBarService } from '@allai/core';
import { IStatusBarController } from '@allai/core/esm/controller';
import { Controller, connect } from '@allai/core/esm/react';
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
