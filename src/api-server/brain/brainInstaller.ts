/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */

import StreamZip from 'node-stream-zip';
import fs from 'fs';
import { BrainCapability, LocalBrainModel } from './domain/models/localBrain';
import makeAddLocalBrain from './factories/usecases/addLocalBrainFactory';
import { getBrainPath } from './const';

export type BrainInstallationResult = {
  success?: boolean;
  error?: Error;
  brain?: LocalBrainModel;
};

export class BrainInstaller {
  installBrain = async (zipPath: string): Promise<BrainInstallationResult> => {
    try {
      const zip = new StreamZip.async({ file: zipPath });

      const data = await zip.entryData('package.json');
      const packageJson = JSON.parse(data.toString('utf8'));

      const localBrain = {
        id: '',
        version: packageJson.version,
        main: packageJson.main,
        name: packageJson.brain.name,
        displayName: packageJson.brain.displayName,
        description: packageJson.brain.description,
        capabilities: packageJson.brain.capabilities as BrainCapability[],
        settingsMap: packageJson.brain.settingsMap,
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

  removeDir = (dirPath: string): void => {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, { recursive: true });
    }
  };
}

const brainInstaller = new BrainInstaller();

export default brainInstaller;
