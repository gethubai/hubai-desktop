import { safeStorage } from 'electron';
import Store from 'electron-store';

export class SafeKeyStore {
  private store: Store;

  constructor(
    private readonly keyName: string,
    fileName?: string,
    encryptionKey?: string // This is just to obfuscate the key in the file system, it's not intended to be secure
  ) {
    this.store = new Store({
      name: fileName || keyName,
      watch: true,
      encryptionKey,
    });
  }

  // Check if the key is set
  isSet = (): boolean => {
    return this.store.has(this.keyName);
  };

  // Encrypt the provided key and store it
  set = (value: string): void => {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption is not available');
    }

    if (this.isSet()) {
      throw new Error(`Key is already set: ${this.keyName}`);
    }

    const encryptedKey = safeStorage.encryptString(value);
    this.store.set(this.keyName, Array.from(encryptedKey));
  };

  delete = (): void => {
    this.store.delete(this.keyName);
  };

  // Retrieve the encrypted key, decrypt it and return it
  get = (): string => {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption is not available');
    }

    const encryptedKeyArray = this.store.get(this.keyName) as number[];

    if (!encryptedKeyArray) return null;

    const encryptedKey = Buffer.from(encryptedKeyArray);

    return safeStorage.decryptString(encryptedKey);
  };

  getBuffer = (): Buffer => {
    const key = this.get();
    return Buffer.from(key, 'hex');
  };
}
