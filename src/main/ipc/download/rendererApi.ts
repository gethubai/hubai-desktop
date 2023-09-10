import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const downloadRendererApi = {
  file(options: {
    url: string;
    filename?: string;
    showBadge?: boolean;
    showProgressBar?: boolean;
    overwrite?: boolean;
  }) {
    return ipcRenderer.send(endpoints.download, options);
  },
};

export default downloadRendererApi;
