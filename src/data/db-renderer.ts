import { getRxStorageIpcRenderer } from 'rxdb/plugins/electron';
import { ipcRenderer } from 'electron';
import { ChatDatabase, internalGetChatDatabase } from './db';
import getStorage from './storage';

const getStorageRendererStorage = () => {
  return getRxStorageIpcRenderer({
    key: 'main-storage',
    statics: getStorage().statics,
    ipcRenderer,
    mode: 'storage',
  });
};

export async function getChatDatabase(): Promise<ChatDatabase> {
  return internalGetChatDatabase(getStorageRendererStorage());
}
