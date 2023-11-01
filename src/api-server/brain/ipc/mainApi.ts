import { ipcMain } from 'electron';
import {
  BrainPromptResponse,
  IAudioTranscriberBrainService,
  IBrainPromptContext,
  IImageGenerationBrainService,
  ITextBrainService,
  ImageGenerationBrainPrompt,
  LocalAudioPrompt,
  TextBrainPrompt,
} from '@hubai/brain-sdk';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import makeCurrentUserService from 'api-server/user/factories/currentUserServiceFactory';
import makeLoadLocalBrains from '../factories/usecases/loadLocalBrainsFactory';
import brainInstaller from '../brainInstaller';
import brainServerManager from '../brainServerManager';
import endpoints from './endpoints';
import { LocalBrainModel } from '../domain/models/localBrain';
import { IBrainServer } from '../brainServer';

ipcMain.on(endpoints.getAll, async (event) => {
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();
  event.returnValue = brains;
});

ipcMain.on(endpoints.install, async (event, brainZipPath: string) => {
  const result = await brainInstaller.installBrain(brainZipPath);
  event.returnValue = result;
});

ipcMain.on(
  endpoints.updateSettings,
  async (event, brainId: string, newSettings: any) => {
    event.returnValue = brainServerManager.updateClientSettings(
      brainId,
      newSettings
    );
  }
);

ipcMain.on(endpoints.uninstall, async (event, brain: LocalBrainModel) => {
  const result = await brainInstaller.uninstall(brain);

  event.returnValue = result;
});

function getBrainWithService<TService>(brainId: string): {
  brain: IBrainServer;
  service: TService;
} {
  const brain = brainServerManager.getClient(brainId);

  if (!brain) {
    throw new Error(`Brain ${brainId} not found`);
  }

  const service = brain.getService() as TService;
  if (!service) {
    throw new Error(`Brain ${brainId} does not support text prompts`);
  }

  return { brain, service };
}

async function buildContext(
  brain: IBrainServer,
  settingsOverride?: any
): Promise<IBrainPromptContext<any>> {
  const user = await makeCurrentUserService().get();

  const settingsOverrideNormalized = settingsOverride ?? {};

  return {
    id: generateUniqueId(),
    senderId: user.id,
    settings: { ...brain.getUserSettings(), ...settingsOverrideNormalized },
  };
}

ipcMain.on(
  endpoints.sendTextPrompt,
  async (
    event,
    brainId: string,
    prompt: TextBrainPrompt[],
    settingsOverride?: any
  ) => {
    try {
      const { brain, service } =
        getBrainWithService<ITextBrainService<any>>(brainId);

      // TODO: Save all the prompts sent in the database, to have an usage history

      const context = await buildContext(brain, settingsOverride);
      const result = await service.sendTextPrompt(prompt, context);

      event.returnValue = result;
    } catch (err: any) {
      console.error(err);
      event.returnValue = {
        result: `Could not generate image: ${err.message}`,
      } as BrainPromptResponse;
    }
  }
);

ipcMain.on(
  endpoints.transcribeAudio,
  async (
    event,
    brainId: string,
    prompt: LocalAudioPrompt,
    settingsOverride?: any
  ) => {
    try {
      const { brain, service } =
        getBrainWithService<IAudioTranscriberBrainService<any>>(brainId);

      const context = await buildContext(brain, settingsOverride);
      const result = await service.transcribeAudio(prompt, context);

      event.returnValue = result;
    } catch (err: any) {
      console.error(err);
      event.returnValue = {
        result: `Could not generate image: ${err.message}`,
      } as BrainPromptResponse;
    }
  }
);

ipcMain.on(
  endpoints.generateImage,
  async (
    event,
    brainId: string,
    prompts: ImageGenerationBrainPrompt[],
    settingsOverride?: any
  ) => {
    try {
      const { brain, service } =
        getBrainWithService<IImageGenerationBrainService<any>>(brainId);

      const context = await buildContext(brain, settingsOverride);
      const result = await service.generateImage(prompts, context);

      event.returnValue = result;
    } catch (err: any) {
      console.error(err);
      event.returnValue = {
        result: `Could not generate image: ${err.message}`,
      } as BrainPromptResponse;
    }
  }
);
