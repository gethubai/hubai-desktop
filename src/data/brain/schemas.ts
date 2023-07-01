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
    version: {
      type: 'string',
      maxLength: 15,
    },
    main: {
      type: 'string',
      maxLength: 100,
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
  required: ['id', 'name', 'capabilities', 'title', 'version'],
  indexes: ['name'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM Methods
export type LocalBrainCollectionMethods = {
  // countAllDocuments: () => Promise<number>;
};
// Entity methods
export type LocalBrainDocMethods = {};

// aggregate the document type from the schema
export type LocalBrainDocType = LocalBrainModel & {
  createdDate: string;
};

// create the typed RxJsonSchema from the literal typed object.
export const LocalBrainSchema: RxJsonSchema<LocalBrainDocType> =
  LocalBrainSchemaLiteral;

export type LocalBrainDocument = RxDocument<
  LocalBrainDocType,
  LocalBrainCollectionMethods
>;

export type LocalBrainCollection = RxCollection<
  LocalBrainDocType,
  LocalBrainDocMethods,
  LocalBrainCollectionMethods
>;

export type BrainDatabaseCollections = {
  brains: LocalBrainCollection;
};
