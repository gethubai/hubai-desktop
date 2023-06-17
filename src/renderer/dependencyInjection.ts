import { container } from 'tsyringe';
import { ChatStateModel, IChatState } from './features/chat/models/chat';

container.register<IChatState>(ChatStateModel, {
  useValue: new ChatStateModel(),
});
