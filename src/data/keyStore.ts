import { safeStorage } from 'electron';
import Store from 'electron-store';

const KEY_NAME = 'encryptedKey';

class KeyStore {
  private store: Store;

  constructor() {
    this.store = new Store({
      name: 'appkey',
      watch: false,
      encryptionKey: 'omg-i-think-i-just-found-mr-robot',
    });
  }

  // Check if the key is set
  isSet(): boolean {
    return this.store.has(KEY_NAME);
  }

  // Encrypt the provided key and store it
  set(value: string): void {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption is not available');
    }

    if (this.isSet()) {
      throw new Error('Key is already set');
    }

    const encryptedKey = safeStorage.encryptString(value);
    this.store.set(KEY_NAME, Array.from(encryptedKey));
  }

  // Retrieve the encrypted key, decrypt it and return it
  get(): string {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption is not available');
    }

    const encryptedKeyArray = this.store.get(KEY_NAME) as number[];

    if (!encryptedKeyArray) throw new Error('Key is not set');

    const encryptedKey = Buffer.from(encryptedKeyArray);

    return safeStorage.decryptString(encryptedKey);
  }

  getBuffer(): Buffer {
    const key = this.get();
    return Buffer.from(key, 'hex');
  }
}

export default new KeyStore();
