import { ipcRenderer } from 'electron';
import {
  BrainPromptResponse,
  ImageGenerationBrainPrompt,
  LocalAudioPrompt,
  TextBrainPrompt,
} from '@hubai/brain-sdk';
import endpoints from './endpoints';
import {
  BrainInstallationResult,
  BrainUninstallationResult,
} from '../models/brainInstallationResult';
import { LocalBrainModel } from '../domain/models/localBrain';

const brainRendererApi = {
  installBrain(brainZipPath: string): BrainInstallationResult {
    return ipcRenderer.sendSync(endpoints.install, brainZipPath);
  },
  uninstallBrain(brain: LocalBrainModel): BrainUninstallationResult {
    return ipcRenderer.sendSync(endpoints.uninstall, brain);
  },
  getInstalledBrains() {
    return ipcRenderer.invoke(endpoints.getAll);
  },
  updateSettings(brainId: string, newSettings: any) {
    return ipcRenderer.sendSync(endpoints.updateSettings, brainId, newSettings);
  },

  sendTextPrompt(
    brainId: string,
    prompts: TextBrainPrompt[],
    settingsOverride?: any
  ): Promise<BrainPromptResponse> {
    return ipcRenderer.invoke(
      endpoints.sendTextPrompt,
      brainId,
      prompts,
      settingsOverride
    );
  },

  generateImage(
    brainId: string,
    prompts: ImageGenerationBrainPrompt[],
    settingsOverride?: any
  ): Promise<BrainPromptResponse> {
    return ipcRenderer.invoke(
      endpoints.generateImage,
      brainId,
      prompts,
      settingsOverride
    );
  },

  transcribeAudio(
    brainId: string,
    prompt: LocalAudioPrompt,
    settingsOverride?: any
  ): Promise<BrainPromptResponse> {
    return ipcRenderer.invoke(
      endpoints.transcribeAudio,
      brainId,
      prompt,
      settingsOverride
    );
  },
};

export default brainRendererApi;
