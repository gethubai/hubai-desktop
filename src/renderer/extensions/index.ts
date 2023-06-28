/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
// import ChatExtension from './chat';

import { IExtension } from '@allai/core';
import ExtensionService from 'mo/services/extensionService';

const loadExtensions = async () => {
  const extensionsToLoad = ['test-extension'];

  const extensions: IExtension[] = [];

  for (const extensionName of extensionsToLoad) {
    const res = await ExtensionService.loadFromSystem(
      `${extensionName}/remoteEntry.js`
    );

    extensions.push(res);
  }

  console.log('Installed extensions loaded:', extensions);

  return extensions;
};

export default loadExtensions;
