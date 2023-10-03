/* eslint-disable max-classes-per-file */
import {
  ChatUser,
  ChatMemberType,
  ChatModel,
  ChatUserRole,
  ChatActivity,
  ChatActivityKind,
} from 'api-server/chat/domain/models/chat';
import {
  ChatMessageModel,
  ChatMessageRecipient,
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
  _id!: string;

  name!: string;

  initiator!: string;

  createdDate!: Date | string;

  messages?: ChatMessageModel[];

  lastActivity?: ChatActivity;

  members!: ChatUser[];

  isDirect?: boolean;

  owner_id?: string;

  public static schema: Realm.ObjectSchema = {
    name: 'Chat',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      name: { type: 'string', indexed: true },
      initiator: { type: 'string', indexed: true },
      members: { type: 'list', objectType: 'ChatUser' },
      createdDate: 'date',
      messages: 'ChatMessage[]',
      lastActivity: 'ChatActivity?',
      isDirect: 'bool?',
      owner_id: 'string?',
    },
  };

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get values(): ChatModel {
    return {
      id: this.id,
      name: this.name,
      initiator: this.initiator,
      createdDate: this.createdDate,
      members: this.members?.map((item) => (item as any).values),
      lastActivity: (this.lastActivity as any)?.values,
      isDirect: this.isDirect,
    } as ChatModel;
  }
}

export class ChatUserDto extends Realm.Object<ChatUser> {
  id!: string;

  memberType!: ChatMemberType;

  settings?: object;

  handleMessageTypes?: ChatMessageType[];

  role?: ChatUserRole;

  static schema = {
    name: 'ChatUser',
    embedded: true,
    properties: {
      id: 'string',
      memberType: 'string',
      settings: '{}',
      handleMessageTypes: 'string[]',
      role: 'string?',
    },
  };

  get values(): ChatUser {
    return {
      id: this.id,
      memberType: this.memberType,
      settings: dictionaryToObject(this.settings as any),
      handleMessageTypes: Array.from(this.handleMessageTypes ?? []),
      role: this.role,
    } as ChatUser;
  }
}

export class ChatActivityDto extends Realm.Object<ChatActivity> {
  executorId!: string;

  value?: string;

  dateUtc!: Date | string;

  kind!: ChatActivityKind;

  static schema = {
    name: 'ChatActivity',
    embedded: true,
    properties: {
      executorId: 'string',
      value: 'string?',
      dateUtc: 'date',
      kind: 'string',
    },
  };

  get values(): ChatActivity {
    return {
      executorId: this.executorId,
      value: this.value,
      dateUtc: this.dateUtc,
      kind: this.kind,
    } as ChatActivity;
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

export class ChatMessageRecipientDto extends Realm.Object<ChatMessageRecipient> {
  id!: string;

  status!: ChatMessageStatus;

  receivedDate?: Date;

  seenDate?: Date;

  static schema = {
    name: 'ChatMessageRecipient',
    embedded: true,
    properties: {
      id: { type: 'string', indexed: true },
      status: 'string',
      receivedDate: 'date?',
      seenDate: 'date?',
    },
  };

  get values(): ChatMessageRecipient {
    return {
      id: this.id,
      status: this.status,
      receivedDate: this.receivedDate,
      seenDate: this.seenDate,
    } as ChatMessageRecipient;
  }
}

export class ChatMessageDto extends Realm.Object<ChatMessageModel> {
  _id!: string;

  senderId!: string;

  recipients!: ChatMessageRecipient[];

  sendDate!: Date | string;

  text?: TextMessage;

  image?: ImageMessage;

  voice?: VoiceMessage;

  messageType!: ChatMessageType;

  status!: ChatMessageStatus;

  chatId!: string;

  hidden?: boolean;

  owner_id?: string;

  static schema = {
    name: 'ChatMessage',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      senderId: { type: 'string', indexed: true },
      status: 'string',
      messageType: 'string',
      text: 'ChatTextMessage?',
      image: 'ChatImageMessage?',
      voice: 'ChatVoiceMessage?',
      sendDate: { type: 'date', indexed: true },
      chatId: { type: 'string', indexed: true },
      recipients: { type: 'list', objectType: 'ChatMessageRecipient' },
      hidden: 'bool?',
      owner_id: 'string?',
    },
  };

  get values(): ChatMessageModel {
    return {
      id: this._id,
      senderId: this.senderId,
      recipients: this.recipients?.map((item) => (item as any).values),
      sendDate: this.sendDate,
      text: (this.text as any)?.values,
      image: (this.image as any)?.values,
      voice: (this.voice as any)?.values,
      messageType: this.messageType,
      status: this.status,
      chat: this.chatId,
      hidden: this.hidden,
    } as ChatMessageModel;
  }
}

const dbBasePath = getAppDatabaseStoragePath('chat');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [
    ChatDto,
    ChatUserDto,
    ChatActivityDto,
    ChatMessageRecipientDto,
    ChatMessageDto,
    ChatTextMessageDto,
    ChatImageMessageDto,
    ChatVoiceMessageDto,
  ],
  schemaVersion: 3,
  // path: dbPath,
};

/* const behaviorConfiguration: Realm.OpenRealmBehaviorConfiguration = {
  type: 'openImmediately', // background sync
}; */
/* Data Sync might be added later */
let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;
  dbPromise = Realm.open({
    ...config,
    encryptionKey: keyStore.getBuffer(),
    path: dbPath,
    /* sync: {
      user: app.currentUser,
      flexible: true,
      newRealmFileBehavior: behaviorConfiguration,
      existingRealmFileBehavior: behaviorConfiguration,
    }, */
  });

  /* const db = await dbPromise;
  db.syncSession?.pause();

  db.subscriptions.update((mutableSubs) => {
    mutableSubs.add(db.objects('Chat'), { name: 'chatsSubscription' });
    mutableSubs.add(db.objects('ChatMessage'), {
      name: 'chatMessagesSubscription',
    });
  }); */

  return dbPromise;
};
