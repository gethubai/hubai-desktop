import { Controller, connect } from '@hubai/core/esm/react';
import { container } from 'tsyringe';
import { IActivityBarController } from 'mo/controllers';
import { type IActivityBarService } from '@hubai/core';
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
