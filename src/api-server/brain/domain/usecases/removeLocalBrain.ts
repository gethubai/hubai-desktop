export type RemoveLocalBrainParams = {
  id: string;
};

export type RemoveLocalBrainModel = {
  success: boolean;
  error?: string;
};

export interface RemoveLocalBrain {
  remove: (params: RemoveLocalBrainParams) => Promise<RemoveLocalBrainModel>;
}
