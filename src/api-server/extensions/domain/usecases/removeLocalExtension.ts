export interface RemoveLocalExtension {
  remove: (
    params: RemoveLocalExtension.Params
  ) => Promise<RemoveLocalExtension.Model>;
}

export namespace RemoveLocalExtension {
  export type Params = {
    id: string;
  };

  export type Model = {
    success: boolean;
    error?: string;
  };
}
