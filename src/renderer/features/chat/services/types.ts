import { ChatModel } from 'api-server/chat/domain/models/chat';
import { Component } from '@allai/core/esm/react';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { Socket } from 'socket.io';
import { IChatState } from '../models/chat';

export interface IChatService extends Component<IChatState> {
  createChat(options: CreateChat.Params): Promise<ChatModel | undefined>;
  updateChatBrains(
    options: UpdateChatBrains.Params
  ): Promise<ChatModel | undefined>;
  sendChatMessage(options: SendChatMessageModel): Promise<ChatMessageModel>;
  getServer(): Socket<any, any> | undefined;
  getChatCount(): number;
  getChat(id: string): Promise<ChatModel>;
}
