import { IChatAssistant, IChatAssistantsManagement } from '@hubai/core';

export class ChatAssistantsManagement implements IChatAssistantsManagement {
  private readonly actors: IChatAssistant[] = [];

  getAssistants(): IChatAssistant[] {
    return this.actors;
  }

  addAssistant(actor: IChatAssistant): void {
    this.actors.push(actor);
  }

  removeAssistant(actorId: string): void {
    const index = this.actors.findIndex((a) => a.id === actorId);

    if (index !== -1) {
      this.actors.splice(index, 1);
    }
  }
}
