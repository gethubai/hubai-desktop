// import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxStorage } from 'rxdb';
import { getRxStorageLoki } from 'rxdb/plugins/storage-lokijs';

const FSDbAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
// const getStorage = () => getRxStorageDexie();

let storage: RxStorage<any, any> | null = null;
const getStorage = () => {
  if (storage == null) {
    storage = getRxStorageLoki({
      adapter: new FSDbAdapter(),
      /*
       * Do not set lokiJS persistence options like autoload and autosave,
       * RxDB will pick proper defaults based on the given adapter
       */
    });
  }
  return storage;
};

export default getStorage;
