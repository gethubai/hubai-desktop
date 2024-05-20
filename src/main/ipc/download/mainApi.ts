import { ipcMain, BrowserWindow } from 'electron';
import electronDl, { download } from 'electron-dl';

import { getDownloadsPath } from 'utils/pathUtils';
import endpoints from './endpoints';

electronDl();

ipcMain.on(
  endpoints.download,
  async (event, { url, filename, showBadge, showProgressBar, overwrite }) => {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      console.error('No focused window found');
      return;
    }

    await download(win, url, {
      showBadge,
      showProgressBar,
      overwrite,
      directory: getDownloadsPath(),
      filename,
      onStarted: () => {
        event.reply('download-started', { url });
      },
      onProgress: (progress) => {
        // error
        if (progress.totalBytes === 0) {
          console.error('Download failed', url);
          event.reply('download-error', {
            url,
            error: 'Download failed',
          });

          return;
        }

        event.reply('download-progress', {
          url,
          progress,
        });
      },
      onCancel: (item) => {
        console.warn('downloadCancelled', item, url);
        event.reply('download-cancelled', {
          url,
        });
      },
      onCompleted: (file) => {
        console.log('downloadCompleted', file, url);
        event.reply('download-completed', {
          url,
          file,
        });
      },
    });
  }
);
