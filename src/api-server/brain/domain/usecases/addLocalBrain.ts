import { LocalBrainModel, LocalBrainSettingMap } from '../models/localBrain';

export interface AddLocalBrain {
  add: (brain: AddLocalBrain.Params) => Promise<AddLocalBrain.Model>;
}

export namespace AddLocalBrain {
  export type Params = {
    name: string;
    displayName?: string;
    description: string;
    version: string;
    main: string;
    capabilities: string[];
    settingsMap?: LocalBrainSettingMap[];
  };
  export type Model = LocalBrainModel;
}
