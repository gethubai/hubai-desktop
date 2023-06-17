import { container } from 'tsyringe';
import { ChatService, IChatService } from './services/chat';

export const chat = container.resolve<IChatService>(ChatService);
