import userSettingsStorage from 'data/user/mainStorage';
import { ChatServerConfigs } from 'api-server/consts';
import { IBrainServer } from './brainServer';
import { SetUserSettingsResult } from './brainService';
import { IBrainSettings } from './brainSettings';

class BrainClientManager {
  connectedClients: IBrainServer[];

  constructor() {
    this.connectedClients = [];
  }

  async addClient(client: IBrainServer) {
    const settings = client.getSettings();
    if (this.isConnected(client)) {
      console.error('client already connected: ', settings.name);
      client.disconnect();
      return;
    }
    this.initService(client, settings);
    await client.start(ChatServerConfigs.address);
    this.connectedClients.push(client);
  }

  initService(client: IBrainServer, settings: IBrainSettings) {
    const brain = client.getService();
    const brainsSettings = userSettingsStorage.get('brain');
    if (!brainsSettings) {
      console.warn('brains settings not found');
      return;
    }

    const brainSetting = brainsSettings[settings.name];
    if (brainSetting) {
      try {
        client.setUserSettingsResult(brain.setUserSettings(brainSetting));
      } catch (e) {
        console.error('Error on setting brain user settings: ', {
          brain,
          brainSetting,
          error: e,
        });
      }
    }
  }

  updateClientSettings(
    clientId: string,
    newSettings: any
  ): SetUserSettingsResult {
    const client = this.getClient(clientId);

    if (!client) {
      return SetUserSettingsResult.createError('Brain client not found');
    }

    const result = client.getService().setUserSettings(newSettings);
    client.setUserSettingsResult(result);
    return result;
  }

  isConnected(client: IBrainServer): boolean {
    return this.getClient(client.getSettings().id) !== undefined;
  }

  getClient(clientId: string): IBrainServer | undefined {
    return this.connectedClients.find((c) => c.getSettings().id === clientId);
  }
}

export default new BrainClientManager();
