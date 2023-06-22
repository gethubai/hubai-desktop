import ElectronSaveLocalBrainSettings from 'api-server/brain/data/usecases/electronSaveLocalBrainSettings';
import { SaveLocalBrainSettings } from 'api-server/brain/domain/usecases/saveLocalBrainSettings';

const makeSaveLocalBrainSettings =
  async (): Promise<SaveLocalBrainSettings> => {
    return new ElectronSaveLocalBrainSettings();
  };

export default makeSaveLocalBrainSettings;
