export type RemoveLocalExtensionParams = {
  id: string;
};

export type RemoveLocalExtensionModel = {
  success: boolean;
  error?: string;
};

export interface RemoveLocalExtension {
  remove: (
    params: RemoveLocalExtensionParams
  ) => Promise<RemoveLocalExtensionModel>;
}
