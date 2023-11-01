import { inject, injectable, singleton } from 'tsyringe';
import { BrainCapability } from 'api-server/brain/domain/models/localBrain';
import { IBrainClient, IBrainClientManager, LocalBrain } from '@hubai/core';
import { type IBrainManagementService } from './brainManagement';
import { ElectronBrainClient } from './electronBrainClient';

@singleton()
@injectable()
export class BrainClientManager implements IBrainClientManager {
  clients: IBrainClient[];

  constructor(
    @inject('IBrainManagementService')
    private readonly brainManagement: IBrainManagementService
  ) {
    this.clients = brainManagement
      .getPackages()
      .map((b) => new ElectronBrainClient(b));

    brainManagement.onPackageUninstalled((brain) => {
      this.clients = this.clients.filter((c) => c.brain.id !== brain.id);
    });
  }

  getClient(brainId: string): IBrainClient | undefined {
    return this.getClients().find((c) => c.brain.id === brainId);
  }

  getClients() {
    if (!this.clients || this.clients.length === 0) {
      this.clients = this.brainManagement
        .getPackages()
        .map((b) => new ElectronBrainClient(b));
    }

    return this.clients;
  }

  getAvailableClients(): IBrainClient[] {
    return this.getClients();
  }

  getAvailableBrains(): LocalBrain[] {
    return this.getClients().map((c) => c.brain);
  }

  getDefaultForCapability(
    capability: BrainCapability
  ): IBrainClient | undefined {
    // TODO: Get default brain from settings
    return this.clients.find((c) => c.brain.capabilities.includes(capability));
  }
}
