import { container } from 'tsyringe';
import { IStatusBarService } from '@hubai/core';
import { Controller, connect } from '@hubai/core/esm/react';
import { type IStatusBarController } from 'mo/controllers';
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
