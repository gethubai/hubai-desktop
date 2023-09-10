export interface RemoveLocalBrain {
  remove: (params: RemoveLocalBrain.Params) => Promise<RemoveLocalBrain.Model>;
}

export namespace RemoveLocalBrain {
  export type Params = {
    id: string;
  };

  export type Model = {
    success: boolean;
    error?: string;
  };
}
