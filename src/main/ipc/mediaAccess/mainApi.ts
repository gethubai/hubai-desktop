import { ipcMain, systemPreferences } from 'electron';
import endpoints from './endpoints';

ipcMain.on(
  endpoints.getMicrophoneAccessStatus,
  async (event, mediaType: 'microphone' | 'camera' | 'screen') => {
    // return value: "not-determined" | "granted" | "denied" | "restricted" | "unknown"
    event.returnValue = systemPreferences.getMediaAccessStatus(mediaType);
  }
);

ipcMain.on(
  endpoints.askForMicrophoneAccess,
  async (event, mediaType: 'microphone' | 'camera') => {
    // return value: A promise that resolves with true if consent was granted and false if it was denied. If an invalid mediaType is passed, the promise will be rejected.
    event.returnValue = await systemPreferences.askForMediaAccess(mediaType);
  }
);
