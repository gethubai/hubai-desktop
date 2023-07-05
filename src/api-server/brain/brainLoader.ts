/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import url from 'url';
import IsDevelopment from 'utils/isDevelopment';
import { IBrainServer } from './brainServer';
import TcpBrainServer from './tcpBrainServer';
import makeLoadLocalBrains from './factories/usecases/loadLocalBrainsFactory';
import { getSupportedPromptTypesFromCapabilities } from './brainSettings';
import brainServerManager from './brainServerManager';
import { getBrainMainPath } from './const';

export async function loadLocalBrains() {
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();

  for (const brain of brains) {
    try {
      const brainPath = getBrainMainPath(brain);
      const brainURL = IsDevelopment()
        ? brainPath
        : url.pathToFileURL(brainPath).toString();

      const brainService = await import(/* webpackIgnore: true */ brainURL);

      const settings = {
        id: brain.id,
        name: brain.name,
        nameAlias: brain.title,
        supportedPromptTypes: getSupportedPromptTypesFromCapabilities(
          brain.capabilities
        ),
      };

      const brainServer: IBrainServer = new TcpBrainServer(
        IsDevelopment() ? brainService.default : brainService.default?.default,
        settings
      );

      brainServerManager.addClient(brainServer);
    } catch (e) {
      console.error('Error on loading brain module: ', e);
    }
  }
}
