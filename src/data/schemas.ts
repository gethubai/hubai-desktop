import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { RxJsonSchema, RxDocument, RxCollection } from 'rxdb';

export const ChatSchemaLiteral = {
  title: 'chat schema',
  description: 'Describes a chat',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    initiator: {
      type: 'string',
      maxLength: 50,
      final: true,
    },
    createdDate: {
      type: 'string',
      format: 'date-time',
    },
    messages: {
      type: 'array',
      ref: 'messages',
      items: {
        type: 'string',
      },
    },
  },
  required: ['id', 'name', 'initiator', 'createdDate'],
  indexes: ['initiator', 'name'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM Methods
export type ChatCollectionMethods = {
  // countAllDocuments: () => Promise<number>;
};
// Entity methods
export type ChatDocMethods = {};

// aggregate the document type from the schema
export type ChatDocType = ChatModel & {};

// create the typed RxJsonSchema from the literal typed object.
export const ChatSchema: RxJsonSchema<ChatDocType> = ChatSchemaLiteral;

export type ChatDocument = RxDocument<ChatDocType, ChatCollectionMethods>;

export type ChatCollection = RxCollection<
  ChatDocType,
  ChatDocMethods,
  ChatCollectionMethods
>;

export const ChatMessageSchemaLiteral = {
  title: 'chat message schema',
  description: 'Describes a chat message',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    sender: {
      type: 'string',
      maxLength: 100,
    },
    senderId: {
      type: 'string',
      maxLength: 50,
    },
    senderType: {
      type: 'string',
      maxLength: 10,
    },
    to: {
      type: 'string',
      maxLength: 100,
    },
    status: {
      type: 'string',
      maxLength: 20,
    },
    messageType: {
      type: 'string',
      maxLength: 10,
    },
    text: {
      type: 'object',
      properties: {
        body: {
          type: 'string',
        },
      },
    },
    image: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
        },
        mimeType: {
          type: 'string',
        },
        caption: {
          type: 'string',
        },
      },
    },
    voice: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
        },
        mimeType: {
          type: 'string',
        },
      },
    },
    sendDate: {
      type: 'string',
      format: 'date-time',
    },
    chat: {
      ref: 'chat', // refers to collection chat
      type: 'string', // ref-values must always be string or ['string','null'] (primary of foreign RxDocument)
    },
  },
  required: ['id', 'sender', 'senderId', 'sendDate', 'contentType'],
  indexes: ['sender', 'senderId'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM Methods
export type ChatMessageCollectionMethods = {
  // countAllDocuments: () => Promise<number>;
};

// Entity methods
export type ChatMessageDocMethods = {};

export type ChatMessageDocType = ChatMessageModel & {};

// create the typed RxJsonSchema from the literal typed object.
export const ChatMessageSchema: RxJsonSchema<ChatMessageDocType> =
  ChatMessageSchemaLiteral;

export type ChatMessageDocument = RxDocument<
  ChatMessageDocType,
  ChatMessageCollectionMethods
>;

export type ChatMessageCollection = RxCollection<
  ChatMessageDocType,
  ChatMessageDocMethods,
  ChatMessageCollectionMethods
>;

export type ChatDatabaseCollections = {
  chat: ChatCollection;
  messages: ChatMessageCollection;
};
