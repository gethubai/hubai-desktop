import { IBrainService } from '@hubai/brain-sdk';
import { IBrainSettings } from './brainSettings';

export interface IBrainServer {
  start(hostUrl: string): Promise<void>;

  disconnect(): Promise<void>;

  getSettings(): IBrainSettings;

  getService(): IBrainService;

  setUserSettings(settings: any): void;
}
