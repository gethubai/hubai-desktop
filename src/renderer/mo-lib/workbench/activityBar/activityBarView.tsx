import { Controller, connect } from '@allai/core/esm/react';
import { container } from 'tsyringe';
import { IActivityBarController, type IActivityBarService } from '@allai/core';
import ActivityBar from './activityBar';

const activityBarService = container.resolve<IActivityBarService>(
  'IActivityBarService'
);
const activityBarController = container.resolve<IActivityBarController>(
  'IActivityBarController'
);

const ActivityBarView = connect(
  activityBarService,
  ActivityBar,
  activityBarController as Controller
);

export default ActivityBarView;
