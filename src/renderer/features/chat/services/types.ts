import { ChatModel } from 'api-server/chat/domain/models/chat';
import { Component } from '@hubai/core/esm/react';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { ChatClientSocket } from 'api-server/chat/chatTcpServer/models/serverClient';
import { IChatState } from '../models/chat';

export interface IChatService extends Component<IChatState> {
  createChat(options: CreateChat.Params): Promise<ChatModel | undefined>;
  updateChatBrains(
    options: UpdateChatBrains.Params
  ): Promise<ChatModel | undefined>;
  sendChatMessage(options: SendChatMessageModel): Promise<ChatMessageModel>;
  getServer(): ChatClientSocket | undefined;
  getChatCount(): number;
  getChat(id: string): Promise<ChatModel>;
}
