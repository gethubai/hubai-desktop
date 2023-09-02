import { RemoveLocalExtension } from 'api-server/extensions/domain/usecases/removeLocalExtension';
import { ILocalExtensionRepository } from 'data/extension/localExtensionRepository';

export default class LocalRemoveLocalExtension implements RemoveLocalExtension {
  constructor(private readonly repository: ILocalExtensionRepository) {}

  remove = async (
    params: RemoveLocalExtension.Params
  ): Promise<RemoveLocalExtension.Model> => {
    const { id } = params;
    try {
      await this.repository.remove(id);
      return {
        success: true,
      };
    } catch (ex: any) {
      return {
        success: false,
        error: ex.message,
      };
    }
  };
}
