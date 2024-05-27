import {
  SaveLocalBrainSettingsParams,
  SaveLocalBrainSettingsResult,
  SaveLocalBrainSettings,
} from 'api-server/brain/domain/usecases/saveLocalBrainSettings';

export default class ElectronSaveLocalBrainSettings
  implements SaveLocalBrainSettings
{
  constructor() {
    /* empty */
  }

  save = async (
    params: SaveLocalBrainSettingsParams
  ): Promise<SaveLocalBrainSettingsResult> => {
    const save = await window.electron.brain.updateSettings(
      params.brainId,
      params.newSettings
    );

    return save;
  };
}
