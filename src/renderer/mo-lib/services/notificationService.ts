import { container } from 'tsyringe';
import { cloneDeep } from 'lodash';
import {
  INotification,
  INotificationItem,
  NotificationModel,
  NotificationStatus,
  INotificationService,
} from '@hubai/core';
import { Component } from '@hubai/core/esm/react';
import { randomId, searchById } from '@hubai/core/esm/common/utils';
import logger from '@hubai/core/esm/common/logger';
import type { UniqueId } from '@hubai/core/esm/common/types';

class NotificationService
  extends Component<INotification>
  implements INotificationService
{
  protected state: INotification;

  constructor() {
    super();
    this.state = container.resolve(NotificationModel);
  }

  public toggleNotification(): void {
    const next = cloneDeep(this.state);
    next.showNotifications = !this.state.showNotifications;
    this.setState(next);
  }

  public update<T>(item: INotificationItem<T>): INotificationItem<T> | null {
    const { data = [] } = this.state;
    if (data.length) {
      const index = data.findIndex(searchById(item.id));
      if (index > -1) {
        const original = data[index];
        data[index] = Object.assign(original, item);
        this.setState({
          ...this.state,
          data: [...data],
        });
        return data[index];
      }
      logger.error('There is no notification be found, please check the id');
    }
    return null;
  }

  public remove(id: UniqueId): void {
    const { data = [] } = this.state;
    if (data.length) {
      const index = data.findIndex(searchById(id));
      if (index > -1) {
        data.splice(index, 1);
        this.setState({
          ...this.state,
          data: [...data],
        });
      } else {
        logger.error('There is no notification be found, please check the id');
      }
    } else {
      logger.error(
        "You can't remove notification because there is no notifications in data."
      );
    }
  }

  public add<T>(items: INotificationItem<T>[]): null | INotificationItem<T>[] {
    const { data = [] } = this.state;

    if (items && items.length) {
      items.forEach((item) => {
        if (item.id === undefined) item.id = randomId();
        item.status = NotificationStatus.WaitRead;
      });
      const arr = [...data, ...items];
      this.setState({
        data: arr,
      });
      return items;
    }
    return null;
  }

  public clear() {
    this.setState({
      data: [],
    });
  }

  public reset() {
    this.setState({
      id: '',
      name: '',
      data: [],
      sortIndex: 1,
      showNotifications: false,
      actionBar: [],
      render: undefined,
    });
  }
}

export default NotificationService;
