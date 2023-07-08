/* eslint-disable promise/catch-or-return */
import React from 'react';
import { prefixClaName } from '@hubai/core/esm/common/className';
// import { loadComponent } from 'renderer/common/dynamicModule';
import useGetKeys from './hooks';

export default function Welcome() {
  const keys = useGetKeys();

  return (
    <div className={prefixClaName('welcome')}>
      {/* <Logo className="logo" /> */}
      <h1 className="title">HubAI</h1>
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
