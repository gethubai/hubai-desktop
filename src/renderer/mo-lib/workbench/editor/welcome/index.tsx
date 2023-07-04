/* eslint-disable promise/catch-or-return */
import React from 'react';
import { prefixClaName } from '@hubai/core/esm/common/className';
// import { loadComponent } from 'renderer/common/dynamicModule';
import ExtensionService from 'mo/services/extensionService';
import { container } from 'tsyringe';
import { IExtension, IExtensionService } from '@hubai/core';
import { Button } from '@hubai/core/esm/components';
import useGetKeys from './hooks';

export default function Welcome() {
  const keys = useGetKeys();
  const folderInput = React.useRef(null);

  return (
    <div className={prefixClaName('welcome')}>
      {/* <Logo className="logo" /> */}
      <h1 className="title">HubAI</h1>

      <Button
        onClick={() => {
          folderInput?.current?.click();
        }}
      >
        Load extension
      </Button>

      <input
        type="file"
        directory=""
        webkitdirectory=""
        style={{ display: 'none' }}
        className="form-control"
        ref={folderInput}
        onChange={async (e) => {
          const remoteEntry = Array.from(e.currentTarget.files).find(
            (file) => file.name === 'remoteEntry.js'
          );

          const extension = await ExtensionService.loadFromSystem(
            remoteEntry?.webkitRelativePath
          );

          const extensions: IExtension[] = [extension];

          container
            .resolve<IExtensionService>('IExtensionService')
            .load(extensions);

          console.log(extension);
          console.log('remoteEntry', remoteEntry);
          console.log('on change', e);
        }}
      />

      {/* <DynamicComponent
        url="plugins://my-plugin/remoteEntry.js"
        scope="my-plugin"
        module="./Module"
  /> */}

      {/* <DynamicComponent
        url="plugins://datasource-extension/remoteEntry.js"
        scope="my-plugin"
        module="./Module"
  /> */}
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
