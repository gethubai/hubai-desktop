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
    icon?: string;
    iconUrl?: string;
    publisher?: string;
    disabled?: boolean;
  };
  export type Model = LocalBrainModel;
}
