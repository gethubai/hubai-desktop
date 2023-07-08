/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
// import ChatExtension from './chat';

import { IExtension } from '@hubai/core';
import ExtensionService from 'mo/services/extensionService';
import makeLoadLocalExtensions from './factories/usecases/makeLoadLocalExtensions';

const loadExtensions = async () => {
  const useCase = await makeLoadLocalExtensions();

  const installedExtensions = await useCase.getExtensions();

  const extensions: IExtension[] = [];

  for (const extension of installedExtensions) {
    // eslint-disable-next-line no-continue
    if (extension.disable === true || !extension.main) continue;
    try {
      const res = await ExtensionService.loadFromSystem(extension.main);

      res.id = extension.id;
      res.name = extension.name;
      res.displayName = extension.displayName;
      res.version = extension.version;
      res.categories = extension.extensionKind;
      res.extensionKind = extension.extensionKind;
      if (extension.contributes)
        res.contributes = {
          ...extension.contributes,
          // load the themes and iconThemes from the extension, because we don't save this in the database
          themes: res.contributes?.themes,
          iconThemes: res.contributes?.iconThemes,
        };
      res.main = extension.main;
      res.icon = extension.icon;
      res.description = extension.description;
      res.publisher = extension.publisher;
      res.path = extension.path;
      res.disable = extension.disable;

      extensions.push(res);
    } catch (err) {
      console.error(`Error loading extension: ${extension.name}`, err);
    }
  }
  console.log('Installed extensions loaded:', extensions);

  return extensions;
};

export default loadExtensions;
