/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */

import StreamZip from 'node-stream-zip';
import fs from 'fs';
import path from 'path';
import { createDirectoryIfNotExists } from 'utils/pathUtils';
import { PackageInstallationState } from 'api-server/packages/model/packageInstallationState';
import { LocalExtensionModel } from './domain/models/localExtension';
import { getExtensionPath } from './const';
import makeAddLocalExtension from './factories/usecases/addLocalExtensionFactory';
import makeRemoveLocalExtension from './factories/usecases/removeLocalExtensionFactory';
import {
  ExtensionInstallationResult,
  ExtensionUninstallationResult,
} from './models/installation';

export class ExtensionInstaller {
  installExtension = async (
    zipPath: string
  ): Promise<ExtensionInstallationResult> => {
    try {
      const zip = new StreamZip.async({ file: zipPath });

      const data = await zip.entryData('manifest.json');
      const manifest = JSON.parse(data.toString('utf8'));

      const localExtension = {
        main: manifest.entryPoint,
        version: manifest.version,
        publisher: manifest.publisher,
        name: manifest.name.toLowerCase(),
        displayName: manifest.displayName,
        extensionKind: manifest.extensionKind,
        contributes: manifest.contributes,
        icon: manifest.icon,
        description: manifest.description,
      } as LocalExtensionModel;

      if (manifest.capabilities) {
        throw new Error(
          'Are you trying to install a brain? Please use the brain installer instead.'
        );
      }

      const extractFolder = getExtensionPath(localExtension);

      const folderName = path.basename(extractFolder);

      if (localExtension.icon) {
        localExtension.iconUrl = `plugins://${folderName}/${localExtension.icon}`;
      }

      // delete extractFolder if already exists
      this.removeDir(extractFolder);

      // Create directory
      createDirectoryIfNotExists(extractFolder);

      await zip.extract(null, extractFolder);
      await zip.close();

      try {
        const addExtensionUseCase = await makeAddLocalExtension();
        const extension = await addExtensionUseCase.add(localExtension);
        return {
          success: true,
          extension: {
            ...extension,
            installationState: PackageInstallationState.pending_reload,
          },
        };
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

  uninstall = async (
    extension: LocalExtensionModel
  ): Promise<ExtensionUninstallationResult> => {
    try {
      const deleteUseCase = await makeRemoveLocalExtension();
      const result = await deleteUseCase.remove({ id: extension.id });

      if (!result.success) {
        return { success: false, error: new Error(result.error) };
      }

      const extensionPath = getExtensionPath(extension);
      this.removeDir(extensionPath);

      console.log(
        `Extension ${extension.name} uninstalled successfully. Path: ${extensionPath}`
      );
      return { success: true };
    } catch (e: any) {
      console.error('Error uninstalling extension: ', e);
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
