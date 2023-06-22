export interface SaveLocalBrainSettings {
  save: (
    params: SaveLocalBrainSettings.Params
  ) => Promise<SaveLocalBrainSettings.Result>;
}

export namespace SaveLocalBrainSettings {
  export type Params = {
    brainId: string;
    newSettings?: any;
  };

  export type Result = {
    success: boolean;
    errors?: string[];
  };
}
