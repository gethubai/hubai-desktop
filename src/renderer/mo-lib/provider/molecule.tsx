import React, { useLayoutEffect } from 'react';
// eslint-disable-next-line import/no-cycle
import { create, IConfigProps } from './create';

export function Provider({
  defaultLocale,
  extensions,
  children,
}: IConfigProps & { children: React.ReactElement }) {
  useLayoutEffect(() => {
    const instance = create({
      defaultLocale,
      extensions,
    });

    instance.render(children);
  }, [children, defaultLocale, extensions]);

  return children;
}
