import { container } from 'tsyringe';
import { type IChatService } from './services/types';

export const chat = container.resolve<IChatService>('IChatService');
