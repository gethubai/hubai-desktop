export type RemoveChatParams = {
  id: string;
};

export type RemoveChatModel = {
  success: boolean;
  error?: string;
};

export interface RemoveChat {
  execute: (params: RemoveChatParams) => Promise<RemoveChatModel>;
}
