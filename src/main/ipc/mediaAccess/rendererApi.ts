import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const mediaAccessRendererApi = {
  async getMicrophoneAccessStatus() {
    return ipcRenderer.sendSync(
      endpoints.getMicrophoneAccessStatus,
      'microphone'
    );
  },

  async askForMicrophoneAccess() {
    return ipcRenderer.sendSync(endpoints.askForMicrophoneAccess, 'microphone');
  },
};

export default mediaAccessRendererApi;
