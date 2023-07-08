/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */

import StreamZip from 'node-stream-zip';
import fs from 'fs';
import { createDirectoryIfNotExists } from 'utils/pathUtils';
import { LocalExtensionModel } from './domain/models/localExtension';
import { getExtensionPath } from './const';
import makeAddLocalExtension from './factories/usecases/addLocalExtensionFactory';

export type ExtensionInstallationResult = {
  success?: boolean;
  error?: Error;
  extension?: LocalExtensionModel;
};

export class ExtensionInstaller {
  installExtension = async (
    zipPath: string
  ): Promise<ExtensionInstallationResult> => {
    try {
      const zip = new StreamZip.async({ file: zipPath });

      const data = await zip.entryData('package.json');
      const packageJson = JSON.parse(data.toString('utf8'));

      const localExtension = {
        main: packageJson.main,
        version: packageJson.version,
        publisher: packageJson.author,
        name: packageJson.extension.name,
        displayName: packageJson.extension.displayName,
        extensionKind: packageJson.extension.extensionKind,
        contributes: packageJson.extension.contributes,
        icon: packageJson.extension.icon,
        description: packageJson.extension.description,
      } as LocalExtensionModel;

      const extractFolder = getExtensionPath(localExtension);

      // delete extractFolder if already exists
      this.removeDir(extractFolder);

      // Create directory
      createDirectoryIfNotExists(extractFolder);

      await zip.extract(null, extractFolder);
      await zip.close();

      try {
        const addExtensionUseCase = await makeAddLocalExtension();
        const extension = await addExtensionUseCase.add(localExtension);
        return { success: true, extension };
      } catch (e: any) {
        console.error('Error adding extension to database: ', e);
        // delete extractFolder if we failed to add extension to database
        this.removeDir(extractFolder);
        return { success: false, error: e };
      }
    } catch (e: any) {
      console.error('Error installing extension: ', e);
      return { success: false, error: e };
    }
  };

  removeDir = (dirPath: string): void => {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, { recursive: true });
    }
  };
}

const extensionInstaller = new ExtensionInstaller();

export default extensionInstaller;
