import React, { useEffect, useRef } from 'react';
import { Button } from '@hubai/core/esm/components';
import { localize } from '@hubai/core/esm/i18n';

interface ILocaleNotificationProps {
  locale: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LocaleNotification({ locale }: ILocaleNotificationProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    // Delay execution to ensure focus on element
    buttonRef.current?.focus();
  }, []);

  return (
    <div
      style={{
        lineHeight: '1.5',
      }}
    >
      <div
        style={{
          direction: 'ltr',
          width: 440,
          whiteSpace: 'normal',
          textAlign: 'left',
        }}
      >
        <p style={{ fontWeight: 'bold' }}>
          {localize('notification.locale.title', '')}
        </p>
        <p>{localize('notification.locale.description', '')}</p>
      </div>
      <div style={{ marginBottom: 2 }}>
        <Button
          ref={buttonRef}
          style={{ width: 150, margin: '0 0 0 auto' }}
          onClick={reload}
        >
          {localize('notification.locale.button', '')}
        </Button>
      </div>
    </div>
  );
}
export default React.memo(LocaleNotification);
