// https://chat.openai.com/api/auth/session
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { RxJsonSchema, RxDocument, RxCollection } from 'rxdb';

export const LocalBrainSchemaLiteral = {
  title: 'local brain schema',
  description: 'Describes a local installed brain',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    name: {
      type: 'string',
      maxLength: 50,
    },
    title: {
      type: 'string',
      maxLength: 100,
    },
    description: {
      type: 'string',
      maxLength: 2000,
    },
    settingsMap: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 50,
          },
          title: {
            type: 'string',
            maxLength: 40,
          },
          description: {
            type: 'string',
            maxLength: 1000,
          },
          type: {
            type: 'string',
            maxLength: 20,
          },
          enumValues: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          defaultValue: {
            type: 'string',
          },
          required: {
            type: 'boolean',
          },
        },
      },
    },
    createdDate: {
      type: 'string',
      format: 'date-time',
    },
    capabilities: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['id', 'name', 'capabilities', 'title'],
  indexes: ['name'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM Methods
export type LocalBrainCollectionMethods = {
  // countAllDocuments: () => Promise<number>;
};
// Entity methods
export type LocalBrainDocMethods = {};

// aggregate the document type from the schema
export type LocalBrainDocType = LocalBrainModel & {};

// create the typed RxJsonSchema from the literal typed object.
export const ChatSchema: RxJsonSchema<LocalBrainDocType> =
  LocalBrainSchemaLiteral;

export type ChatDocument = RxDocument<
  LocalBrainDocType,
  LocalBrainCollectionMethods
>;

export type ChatCollection = RxCollection<
  LocalBrainDocType,
  LocalBrainDocMethods,
  LocalBrainCollectionMethods
>;
