import { IBrainService, SetUserSettingsResult } from './brainService';
import { IBrainSettings } from './brainSettings';

export interface IBrainServer {
  start(hostUrl: string): Promise<void>;

  disconnect(): Promise<void>;

  getSettings(): IBrainSettings;

  getService(): IBrainService;

  setUserSettingsResult(result: SetUserSettingsResult): void;
}
