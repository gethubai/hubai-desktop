import { container } from 'tsyringe';
import { ChatStateModel, IChatState } from './features/chat/models/chat';
import { BrainStateModel, IBrainState } from './features/brain/models/brain';

container.register<IChatState>(ChatStateModel, {
  useValue: new ChatStateModel(),
});

container.register<IBrainState>(BrainStateModel, {
  useValue: new BrainStateModel(),
});
