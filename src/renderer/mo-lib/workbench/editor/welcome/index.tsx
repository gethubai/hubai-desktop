/* eslint-disable promise/catch-or-return */
import React from 'react';
import { prefixClaName } from '@hubai/core/esm/common/className';
// import { loadComponent } from 'renderer/common/dynamicModule';
import useGetKeys from './hooks';
import Logo from './logo';

export default function Welcome() {
  const keys = useGetKeys();

  return (
    <div className={prefixClaName('welcome')}>
      <Logo className="logo" />
      <div className="keybindings">
        <ul>
          {keys.map((item) => {
            return (
              <li className="keys" key={item.id}>
                <span>{item.name}</span>
                <span>{item.keybindings.split('').join(' ')}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
