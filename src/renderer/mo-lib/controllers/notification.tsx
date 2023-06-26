import React from 'react';
import { inject, injectable } from 'tsyringe';
import { connect } from '@allai/core/esm/react';
import {
  Float,
  IStatusBarItem,
  INotificationItem,
  type IStatusBarService,
  type INotificationService,
  type IBuiltinService,
  INotificationController,
} from '@allai/core';
import { Controller } from '@allai/core/esm/react/controller';
import { IActionBarItemProps } from '@allai/core/esm/components/actionBar';
import { NotificationStatusBarView } from '@allai/core/esm/workbench/notification';

@injectable()
class NotificationController
  extends Controller
  implements INotificationController
{
  constructor(
    @inject('IStatusBarService') private statusBarService: IStatusBarService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('INotificationService')
    private notificationService: INotificationService
  ) {
    super();
  }

  public onCloseNotification = (item: INotificationItem<any>): void => {
    this.notificationService.remove(item.id);
  };

  public toggleNotifications() {
    this.notificationService.toggleNotification();
  }

  public onClick = (e: React.MouseEvent, item: IStatusBarItem) => {
    this.toggleNotifications();
  };

  public onActionBarClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    item: IActionBarItemProps<any>
  ) => {
    const action = item.id;
    const { NOTIFICATION_CLEAR_ALL_ID, NOTIFICATION_HIDE_ID } =
      this.builtinService.getConstants();

    if (action === NOTIFICATION_CLEAR_ALL_ID) {
      this.notificationService.clear();
    } else if (action === NOTIFICATION_HIDE_ID) {
      this.toggleNotifications();
    }
  };

  public initView() {
    const { builtInNotification, NOTIFICATION_CLEAR_ALL, NOTIFICATION_HIDE } =
      this.builtinService.getModules();

    if (builtInNotification) {
      const NotificationView = connect(
        this.notificationService,
        NotificationStatusBarView
      );
      /* istanbul ignore next */
      const defaultNotification = {
        ...builtInNotification,
        actionBar: [NOTIFICATION_CLEAR_ALL, NOTIFICATION_HIDE].filter(
          Boolean
        ) as IActionBarItemProps[],
        render: () => (
          <NotificationView
            onClick={this.onClick}
            onActionBarClick={this.onActionBarClick}
            onCloseNotification={this.onCloseNotification}
          />
        ),
      };
      this.notificationService.setState({
        ...defaultNotification,
      });
      this.statusBarService.add(defaultNotification, Float.right);
    }
  }
}

export default NotificationController;
