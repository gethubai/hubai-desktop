/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  protocol,
  systemPreferences,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import {
  createDirectoryIfNotExists,
  getBrainsStoragePath,
  getExtensionsStoragePath,
  getMessageAudioStoragePath,
  getMessageStoragePath,
} from 'utils/pathUtils';
import brainServerManager from 'api-server/brain/brainServerManager';
import userSettingsStorage from 'data/user/mainStorage';
import makeLoadLocalBrains from 'api-server/brain/factories/usecases/loadLocalBrainsFactory';
import brainInstaller from 'api-server/brain/brainInstaller';
import keyStore from 'data/keyStore';
import { generateSecureRandom64ByteKey } from 'utils/securityUtils';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  BrainIpcApiConfigs,
  MediaAccessIpcApiConfigs,
  UserSettingsIpcApiConfigs,
} from './consts';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (!isDebug) {
  console.log = log.log;
  Object.assign(console, log.functions);
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on(UserSettingsIpcApiConfigs.endpoints.get, async (event, val) => {
  event.returnValue = userSettingsStorage.get(val);
});
ipcMain.on(UserSettingsIpcApiConfigs.endpoints.getAll, async (event) => {
  event.returnValue = userSettingsStorage.getAll();
});
ipcMain.on(
  UserSettingsIpcApiConfigs.endpoints.setSetting,
  async (event, key, val) => {
    userSettingsStorage.setSetting(key, val);
  }
);

ipcMain.on(UserSettingsIpcApiConfigs.endpoints.set, async (event, val) => {
  userSettingsStorage.set(val);
});

ipcMain.on(BrainIpcApiConfigs.endpoints.getAll, async (event) => {
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();
  event.returnValue = brains;
});

ipcMain.on(
  BrainIpcApiConfigs.endpoints.install,
  async (event, brainZipPath: string) => {
    const result = await brainInstaller.installBrain(brainZipPath);
    event.returnValue = result;
  }
);

ipcMain.on(
  BrainIpcApiConfigs.endpoints.updateSettings,
  async (event, brainId: string, newSettings: any) => {
    event.returnValue = brainServerManager.updateClientSettings(
      brainId,
      newSettings
    );
  }
);

ipcMain.on(
  MediaAccessIpcApiConfigs.endpoints.getMicrophoneAccessStatus,
  async (event, mediaType: 'microphone' | 'camera' | 'screen') => {
    // return value: "not-determined" | "granted" | "denied" | "restricted" | "unknown"
    event.returnValue = systemPreferences.getMediaAccessStatus(mediaType);
  }
);

ipcMain.on(
  MediaAccessIpcApiConfigs.endpoints.askForMicrophoneAccess,
  async (event, mediaType: 'microphone' | 'camera') => {
    // return value: A promise that resolves with true if consent was granted and false if it was denied. If an invalid mediaType is passed, the promise will be rejected.
    event.returnValue = await systemPreferences.askForMediaAccess(mediaType);
  }
);

ipcMain.on('restart-app', () => {
  app.relaunch();
  app.exit();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

let splash: BrowserWindow;
const createSplashScreen = () => {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile(getAssetPath('splash.html'));
  splash.center();
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // splash.close();
    splash.destroy();
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('show', () => {
    mainWindow?.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('path:', {
  appData: app.getPath('appData'),
  userData: app.getPath('userData'),
  music: app.getPath('music'),
  temp: app.getPath('temp'),
  module: app.getPath('module'),
  app: app.getAppPath(),
  sessionData: app.getPath('sessionData'),
  home: app.getPath('home'),
  exe: app.getPath('exe'),
});

app
  .whenReady()
  .then(async () => {
    createSplashScreen();
    // Generate key if not exists
    if (!keyStore.isSet()) keyStore.set(generateSecureRandom64ByteKey());

    createDirectoryIfNotExists(getMessageStoragePath(''));
    createDirectoryIfNotExists(getMessageAudioStoragePath(''));
    createDirectoryIfNotExists(getExtensionsStoragePath(''));
    createDirectoryIfNotExists(getBrainsStoragePath(''));

    const { startServer } = await require('../api-server/server');
    startServer();

    protocol.registerFileProtocol('msg', (request, callback) => {
      const relativePath =
        request.url.substr(6); /* all urls start with 'msg://' */
      const filePath = getMessageStoragePath(relativePath);
      try {
        const decodedUrl = decodeURI(filePath); // Decodes the url if it is encoded
        return callback(decodedUrl);
      } catch (error) {
        // Handle the error as needed
        console.error('ERROR on msg protocol: ', error);
      }
    });

    protocol.registerFileProtocol('plugins', (request, callback) => {
      const extensionRelativePath =
        request.url.substr(10); /* all urls start with 'plugins://' */

      const pluginUrl = getExtensionsStoragePath(extensionRelativePath);

      try {
        const decodedUrl = decodeURI(pluginUrl); // Decodes the url if it is encoded
        return callback(decodedUrl);
      } catch (error) {
        // Handle the error as needed
        console.error('ERROR on plugins protocol: ', error);
      }
    });

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
