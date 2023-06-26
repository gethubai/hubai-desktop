import React, { lazy, Suspense } from 'react';
import { prefixClaName } from 'mo/common/className';
import DynamicComponent from 'renderer/components/dynamicComponent';
import Logo from './logo';
import { useGetKeys } from './hooks';

export default function Welcome() {
  const keys = useGetKeys();

  return (
    <div className={prefixClaName('welcome')}>
      {/* <Logo className="logo" /> */}
      <h1 className="title">All AI</h1>
      <div>
        its working!
        {/* <DynamicComponent
          url="http://localhost:3333/plugins/my-plugin/remoteEntry.js"
          scope="plugme"
          module="./Module" msg://audio/${message.id}.wav
  /> */}
        <DynamicComponent
          url="plugins://my-plugin/remoteEntry.js"
          scope="plugme"
          module="./Module"
        />
      </div>
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
