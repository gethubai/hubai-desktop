import { SafeKeyStore } from 'utils/keyStore';

const KEY_NAME = 'encryptedKey';

export default new SafeKeyStore(
  KEY_NAME,
  'appkey',
  'omg-i-think-i-just-found-mr-robot'
);
