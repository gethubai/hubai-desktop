export type SaveLocalBrainSettingsParams = {
  brainId: string;
  newSettings?: any;
};

export type SaveLocalBrainSettingsResult = {
  success: boolean;
  errors?: string[];
};

export interface SaveLocalBrainSettings {
  save: (
    params: SaveLocalBrainSettingsParams
  ) => Promise<SaveLocalBrainSettingsResult>;
}
