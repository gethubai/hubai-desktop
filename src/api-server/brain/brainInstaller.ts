/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */

import StreamZip from 'node-stream-zip';
import fs from 'fs';
import { BrainCapability, LocalBrainModel } from './domain/models/localBrain';
import makeAddLocalBrain from './factories/usecases/addLocalBrainFactory';
import { getBrainPath } from './const';
import {
  BrainInstallationResult,
  BrainUninstallationResult,
} from './models/brainInstallationResult';
import makeRemoveLocalBrain from './factories/usecases/removeLocalBrainFactory';

export class BrainInstaller {
  installBrain = async (zipPath: string): Promise<BrainInstallationResult> => {
    try {
      const zip = new StreamZip.async({ file: zipPath });

      const data = await zip.entryData('manifest.json');
      const manifest = JSON.parse(data.toString('utf8'));

      // TODO: Read changeLog and Readme.md files

      const localBrain = {
        id: '',
        version: manifest.version,
        main: manifest.entryPoint,
        name: manifest.name,
        displayName: manifest.displayName,
        description: manifest.description,
        capabilities: manifest.capabilities as BrainCapability[],
        settingsMap: manifest.settingsMap,
        repositoryUrl: manifest.repositoryUrl,
        icon: manifest.icon,
        publisher: { id: manifest.publisherId, name: manifest.publisherName },
      };

      const extractFolder = getBrainPath(localBrain);

      // delete extractFolder if already exists
      this.removeDir(extractFolder);

      await zip.extract(null, extractFolder);
      await zip.close();

      try {
        const addBrainUseCase = await makeAddLocalBrain();
        const brain = await addBrainUseCase.add(localBrain);
        return { success: true, brain };
      } catch (e: any) {
        console.error('Error adding brain to database: ', e);
        // delete extractFolder if we failed to add brain to database
        this.removeDir(extractFolder);
        return { success: false, error: e };
      }
    } catch (e: any) {
      console.error('Error installing brain: ', e);
      return { success: false, error: e };
    }
  };

  uninstall = async (
    brain: LocalBrainModel
  ): Promise<BrainUninstallationResult> => {
    try {
      const deleteUseCase = await makeRemoveLocalBrain();
      const result = await deleteUseCase.remove({ id: brain.id });

      if (!result.success) {
        return { success: false, error: new Error(result.error) };
      }

      const extensionPath = getBrainPath(brain);
      this.removeDir(extensionPath);

      console.log(
        `Brain ${brain.name} uninstalled successfully. Path: ${extensionPath}`
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

const brainInstaller = new BrainInstaller();

export default brainInstaller;
