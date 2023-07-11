import Realm from 'realm';

export const dictionaryToObject = (dictionary: Realm.Dictionary<any>) => {
  if (!dictionary) return dictionary;

  return Object.entries(dictionary).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};
