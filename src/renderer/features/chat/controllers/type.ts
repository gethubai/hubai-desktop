import { Controller } from 'mo/react/controller';
import { IChatItem } from '../models/chat';

export interface IChatController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
}

export interface IChatWindowController extends Partial<Controller> {
  onSendMessage?: (message: string) => void;
}
