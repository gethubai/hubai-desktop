/* eslint-disable max-classes-per-file */
import { ChatBrain, ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatMessageModel,
  ChatMessageSenderType,
  ChatMessageStatus,
  ChatMessageType,
  ImageMessage,
  TextMessage,
  VoiceMessage,
} from 'api-server/chat/domain/models/chatMessage';
import keyStore from 'data/keyStore';
import { dictionaryToObject } from 'data/realm/helpers';
import path from 'path';
import Realm from 'realm';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';

export class ChatDto extends Realm.Object<ChatModel> {
  id!: string;

  name!: string;

  initiator!: string;

  createdDate!: Date | string;

  messages?: ChatMessageModel[];

  brains!: ChatBrain[];

  public static schema: Realm.ObjectSchema = {
    name: 'Chat',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      initiator: { type: 'string', indexed: true },
      brains: { type: 'list', objectType: 'ChatBrain' },
      createdDate: 'date',
      messages: 'ChatMessage[]',
    },
  };

  get values(): ChatModel {
    return {
      id: this.id,
      name: this.name,
      initiator: this.initiator,
      createdDate: this.createdDate,
      messages: this.messages?.map((item) => (item as any).values),
      brains: this.brains?.map((item) => (item as any).values),
    } as ChatModel;
  }
}

export class ChatBrainDto extends Realm.Object {
  id!: string;

  handleMessageType!: ChatMessageType;

  scopedSettings?: object;

  static schema = {
    name: 'ChatBrain',
    embedded: true,
    properties: {
      id: 'string',
      handleMessageType: 'string',
      scopedSettings: '{}',
    },
  };

  get values(): ChatBrain {
    return {
      id: this.id,
      handleMessageType: this.handleMessageType,
      scopedSettings: dictionaryToObject(this.scopedSettings as any),
    } as ChatBrain;
  }
}

export class ChatTextMessageDto extends Realm.Object<TextMessage> {
  body!: string;

  static schema = {
    name: 'ChatTextMessage',
    embedded: true,
    properties: {
      body: 'string',
    },
  };

  get values(): TextMessage {
    return {
      body: this.body,
    } as TextMessage;
  }
}

export class ChatImageMessageDto extends Realm.Object<ImageMessage> {
  file!: string;

  mimeType?: string;

  caption?: string;

  static schema = {
    name: 'ChatImageMessage',
    embedded: true,
    properties: {
      file: 'string',
      mimeType: 'string',
      caption: 'string',
    },
  };

  get values(): ImageMessage {
    return {
      file: this.file,
      mimeType: this.mimeType,
      caption: this.caption,
    } as ImageMessage;
  }
}

export class ChatVoiceMessageDto extends Realm.Object<VoiceMessage> {
  file!: string;

  mimeType?: string;

  static schema = {
    name: 'ChatVoiceMessage',
    embedded: true,
    properties: {
      file: 'string',
      mimeType: 'string',
    },
  };

  get values(): VoiceMessage {
    return {
      file: this.file,
      mimeType: this.mimeType,
    } as VoiceMessage;
  }
}

export class ChatMessageDto extends Realm.Object<ChatMessageModel> {
  id!: string;

  sender!: string;

  senderId!: string;

  senderType!: ChatMessageSenderType;

  to!: string; // id of the brain that will receive the message

  sendDate!: Date | string;

  text?: TextMessage;

  image?: ImageMessage;

  voice?: VoiceMessage;

  messageType!: ChatMessageType;

  status!: ChatMessageStatus;

  chatId!: string;

  static schema = {
    name: 'ChatMessage',
    primaryKey: 'id',
    properties: {
      id: 'string',
      sender: 'string',
      senderId: { type: 'string', indexed: true },
      senderType: 'string',
      to: { type: 'string', indexed: true },
      status: 'string',
      messageType: 'string',
      text: 'ChatTextMessage?',
      image: 'ChatImageMessage?',
      voice: 'ChatVoiceMessage?',
      sendDate: { type: 'date', indexed: true },
      chatId: { type: 'string', indexed: true },
    },
  };

  get values(): ChatMessageModel {
    return {
      id: this.id,
      sender: this.sender,
      senderId: this.senderId,
      senderType: this.senderType,
      to: this.to,
      sendDate: this.sendDate,
      text: (this.text as any)?.values,
      image: (this.image as any)?.values,
      voice: (this.voice as any)?.values,
      messageType: this.messageType,
      status: this.status,
      chat: this.chatId,
    } as ChatMessageModel;
  }
}

const dbBasePath = getAppDatabaseStoragePath('chat');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [
    ChatDto,
    ChatBrainDto,
    ChatMessageDto,
    ChatTextMessageDto,
    ChatImageMessageDto,
    ChatVoiceMessageDto,
  ],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
