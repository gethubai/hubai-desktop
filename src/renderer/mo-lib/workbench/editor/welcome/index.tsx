/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import { prefixClaName } from '@hubai/core/esm/common/className';
import useGetKeys from './hooks';
import Logo from './logo';

const appVersion = window.electron.getAppVersion();

export default function Welcome() {
  const keys = useGetKeys();

  return (
    <div className={prefixClaName('welcome')}>
      <Logo className="logo" />v{appVersion}
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

        <h3>First time here?</h3>
        <a
          onClick={() =>
            window.open(
              'https://www.hubai.app/blog/2023/10/21/how-to-get-started',
              '_blank'
            )
          }
        >
          See how to install and use your first AI
        </a>
      </div>
    </div>
  );
}
