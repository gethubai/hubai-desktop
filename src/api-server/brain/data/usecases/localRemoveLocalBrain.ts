import { RemoveLocalBrain } from 'api-server/brain/domain/usecases/removeLocalBrain';
import { ILocalBrainRepository } from 'data/brain/localBrainRepository';

export default class LocalRemoveLocalBrain implements RemoveLocalBrain {
  constructor(private readonly repository: ILocalBrainRepository) {}

  remove = async (
    params: RemoveLocalBrain.Params
  ): Promise<RemoveLocalBrain.Model> => {
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
