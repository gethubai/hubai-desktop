import { SaveLocalBrainSettings } from 'api-server/brain/domain/usecases/saveLocalBrainSettings';

export default class ElectronSaveLocalBrainSettings
  implements SaveLocalBrainSettings
{
  constructor() {}

  save = async (
    params: SaveLocalBrainSettings.Params
  ): Promise<SaveLocalBrainSettings.Result> => {
    const save = await window.electron.brain.updateSettings(
      params.brainId,
      params.newSettings
    );

    return save;
  };
}
