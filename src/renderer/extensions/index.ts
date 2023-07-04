/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
// import ChatExtension from './chat';

import { IExtension } from '@hubai/core';
import ExtensionService from 'mo/services/extensionService';

const loadExtensions = async () => {
  // TODO: Load installed extensions from the database
  const extensionsToLoad = [];

  const extensions: IExtension[] = [];

  for (const extensionName of extensionsToLoad) {
    try {
      const res = await ExtensionService.loadFromSystem(
        `${extensionName}/remoteEntry.js`
      );

      extensions.push(res);
    } catch (err) {
      console.error(`Error loading extension: ${extensionName}`, err);
    }
  }

  console.log('Installed extensions loaded:', extensions);

  return extensions;
};

export default loadExtensions;
