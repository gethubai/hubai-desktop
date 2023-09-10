import { getBrainManifest } from 'api-server/brain/const';
import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import { ILocalBrainRepository } from 'data/brain/localBrainRepository';

export default class LocalDbLoadLocalBrains implements LoadLocalBrains {
  constructor(private readonly repository: ILocalBrainRepository) {}

  getBrains = async (): Promise<LocalBrainModel[]> => {
    const brains = await this.repository.getBrains();

    return brains.map((brain) => {
      const directoryName = `${brain.name}-${brain.version}`;

      const manifest = getBrainManifest(brain as any);

      return {
        ...brain,
        description: manifest.description,
        capabilities: manifest.capabilities as BrainCapability[],
        icon: manifest.icon,
        iconUrl: manifest.icon
          ? `plugins://${directoryName}/${manifest.icon}`
          : undefined,
        publisher: manifest.publisher,
        main: manifest.entryPoint,
        settingsMap: manifest.settingsMap,
        repositoryUrl: manifest.repositoryUrl,
      } as LocalBrainModel;
    });
  };
}
