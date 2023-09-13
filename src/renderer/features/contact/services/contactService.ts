import { Contact } from 'api-server/contact/domain/models/contact';
import { inject, injectable, singleton } from 'tsyringe';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { type IContactService } from '../models/service';

@singleton()
@injectable()
export class ContactService implements IContactService {
  private contacts?: Contact[];

  constructor(
    @inject('IBrainManagementService')
    brainManagementService: IBrainManagementService
  ) {
    brainManagementService.onPackageInstalled(() => {
      this.updateList();
    });
  }

  list(): Contact[] {
    if (!this.contacts) {
      this.updateList();
    }

    return this.contacts ?? [];
  }

  get(id: string): Contact | undefined {
    return this.list().find((c) => c.id === id);
  }

  private updateList() {
    const contacts = window.electron.contacts.listContacts();

    this.contacts = contacts;
  }
}
