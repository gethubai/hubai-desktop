import { IExtension, IContributeType } from '@hubai/core';

const en = require('./locales/en.json');

const locales = [en];

export const ExtendsLocales: IExtension = {
  id: 'ExtendsLocales',
  name: 'Extends locales',
  contributes: {
    [IContributeType.Languages]: locales,
  },
  activate() {},
  dispose() {},
};
export const BuiltInLocales = locales;
export const BuiltInId = en.id;
export const BuiltInDefault = locales.find((item) => item.id === BuiltInId);
