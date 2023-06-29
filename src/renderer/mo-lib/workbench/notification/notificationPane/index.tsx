import React, { memo } from 'react';
import { INotification } from '@allai/core/esm/model/notification';
import { INotificationController } from '@allai/core/esm/controller/notification';
import {
  classNames,
  getBEMElement,
  getBEMModifier,
  prefixClaName,
} from '@allai/core/esm/common/className';
import { ActionBar } from '@allai/core/esm/components/actionBar';
import { shadowClassName } from '@allai/core/esm/components/contextView/base';
import { Icon } from '@allai/core/esm/components/icon';
import { localize } from '@allai/core/esm/i18n/localize';

export const defaultNotificationClassName = prefixClaName('notification');
const notificationHeaderClassName = getBEMElement(
  defaultNotificationClassName,
  'header'
);
const notificationBodyClassName = getBEMElement(
  defaultNotificationClassName,
  'body'
);
const notificationItemClassName = getBEMElement(
  defaultNotificationClassName,
  'item'
);
const notificationCloseClassName = getBEMModifier(
  defaultNotificationClassName,
  'close'
);

export function NotificationPane(
  props: INotification & Partial<INotificationController>
) {
  const {
    data = [],
    actionBar = [],
    showNotifications,
    onActionBarClick,
    onCloseNotification,
  } = props;
  const hasNotifications = data.length > 0;
  const title = hasNotifications
    ? localize('notification.title', 'notifications')
    : localize('notification.title.no', 'no new notifications');
  const display = showNotifications ? 'block' : 'none';

  return (
    <div
      className={classNames(defaultNotificationClassName, shadowClassName)}
      style={{ display }}
    >
      <header className={notificationHeaderClassName}>
        <span>{title}</span>
        <ActionBar data={actionBar} onClick={onActionBarClick} />
      </header>
      <div className={notificationBodyClassName}>
        {data.map((item) => (
          <div className={notificationItemClassName} key={item.id}>
            <Icon
              title="Clear Notification"
              onClick={() => onCloseNotification?.(item)}
              className={notificationCloseClassName}
              type="close"
            />
            {typeof item.render === 'function' ? item.render(item) : item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
export default memo(NotificationPane);
