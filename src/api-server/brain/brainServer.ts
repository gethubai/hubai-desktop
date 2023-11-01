import { IBrainService } from '@hubai/brain-sdk';
import { IBrainSettings } from './brainSettings';

export interface IBrainServer {
  start(hostUrl: string): Promise<void>;

  disconnect(): Promise<void>;

  getBrain(): IBrainSettings;

  getService(): IBrainService;

  getUserSettings(): any | undefined;

  setUserSettings(settings: any): void;
}
