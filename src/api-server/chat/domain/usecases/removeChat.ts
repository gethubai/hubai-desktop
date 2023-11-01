export interface RemoveChat {
  execute: (params: RemoveChat.Params) => Promise<RemoveChat.Model>;
}

export namespace RemoveChat {
  export type Params = {
    id: string;
  };

  export type Model = {
    success: boolean;
    error?: string;
  };
}
