import { ChatModel } from 'api-server/chat/domain/models/chat';
import { Component } from '@hubai/core/esm/react';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { IChatCommandCompletion } from '@hubai/core/esm/model/chat';
import { Contact } from 'api-server/contact/domain/models/contact';
import { IChatItem, IChatState } from '../models/chat';
import { IChatClient } from '../sdk/contracts';

export interface IChatService extends Component<IChatState> {
  createChat(options: CreateChat.Params): Promise<ChatModel | undefined>;
  getChatCount(): number;
  getChat(id: string): Promise<ChatModel>;
  getClient(): IChatClient;
  parseChat(chat: ChatModel, contacts?: Record<string, Contact>): IChatItem;

  addCompletionCommand(command: IChatCommandCompletion): void;
  getCompletionCommands(): IChatCommandCompletion;
}
