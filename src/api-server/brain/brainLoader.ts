import url from 'url';
import IsDevelopment from 'utils/isDevelopment';
import { IBrainServer } from './brainServer';
import BrainChatClient from './brainChatClient';
import makeLoadLocalBrains from './factories/usecases/loadLocalBrainsFactory';
import { getSupportedPromptTypesFromCapabilities } from './brainSettings';
import brainServerManager from './brainServerManager';
import { getBrainMainPath } from './const';

export async function loadLocalBrains() {
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();

  brains.forEach(async (brain) => {
    try {
      const brainPath = getBrainMainPath(brain);
      const brainURL = IsDevelopment()
        ? brainPath
        : url.pathToFileURL(brainPath).toString();

      const brainService = await import(/* webpackIgnore: true */ brainURL);

      const settings = {
        id: brain.id,
        name: brain.name,
        displayName: brain.displayName,
        supportedPromptTypes: getSupportedPromptTypesFromCapabilities(
          brain.capabilities
        ),
      };

      const brainServer: IBrainServer = new BrainChatClient(
        IsDevelopment() ? brainService.default : brainService.default?.default,
        settings
      );

      brainServerManager.addClient(brainServer);
    } catch (e) {
      console.error('Error on loading brain module: ', e);
    }
  });
}
