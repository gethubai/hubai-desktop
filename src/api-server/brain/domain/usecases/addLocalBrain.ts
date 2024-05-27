import { LocalBrainModel, LocalBrainSettingMap } from '../models/localBrain';

export type AddLocalBrainParams = {
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

export type AddLocalBrainModel = LocalBrainModel;

export interface AddLocalBrain {
  add: (brain: AddLocalBrainParams) => Promise<AddLocalBrainModel>;
}
