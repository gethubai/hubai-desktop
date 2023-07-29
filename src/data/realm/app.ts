import Realm from 'realm';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';

const syncPath = getAppDatabaseStoragePath('realmSync');
createDirectoryIfNotExists(syncPath);

const app = new Realm.App({
  id: 'devicesync-nuqmp',
  baseFilePath: syncPath,
});

export default app;
