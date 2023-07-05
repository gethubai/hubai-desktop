import { SaveLocalBrainSettings } from 'api-server/brain/domain/usecases/saveLocalBrainSettings';
import ElectronSaveLocalBrainSettings from '../../data/usecases/electronSaveLocalBrainSettings';

const makeSaveLocalBrainSettings =
  async (): Promise<SaveLocalBrainSettings> => {
    return new ElectronSaveLocalBrainSettings();
  };

export default makeSaveLocalBrainSettings;
