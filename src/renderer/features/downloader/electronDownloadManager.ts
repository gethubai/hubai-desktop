import { injectable, singleton } from 'tsyringe';
import { DownloadOptions, IDownloadManager } from './downloadManager';
import { DownloadCompleted, DownloadProgress } from './models';

@singleton()
@injectable()
export class ElectronDownloadManager implements IDownloadManager {
  private readonly activeDownloads: Record<string, DownloadOptions> = {};

  constructor() {
    // @ts-ignore
    window.electron.ipcRenderer.on('download-started', (url: string) => {
      const options = this.activeDownloads[url];
      if (options?.onStarted) {
        options.onStarted();
      }
    });

    window.electron.ipcRenderer.on(
      'download-progress', // @ts-ignore
      ({ url, progress }: { url: string; progress: DownloadProgress }) => {
        const options = this.activeDownloads[url];
        if (options?.onProgress) {
          options.onProgress(progress);
        }
      }
    );

    window.electron.ipcRenderer.on(
      'download-cancelled', // @ts-ignore
      (url: string) => {
        const options = this.activeDownloads[url];
        if (options?.onCancel) {
          options.onCancel();
        }

        delete this.activeDownloads[url];
      }
    );

    window.electron.ipcRenderer.on(
      'download-completed', // @ts-ignore
      ({ url, file }: { url: string; file: DownloadCompleted }) => {
        const options = this.activeDownloads[url];
        if (options?.onCompleted) {
          options.onCompleted({
            ...file,
            filename: options?.filename ?? file.filename,
            originalFileName: file.filename,
          });
        }

        delete this.activeDownloads[url];
      }
    );

    window.electron.ipcRenderer.on(
      'download-error', // @ts-ignore
      ({ url, error }: { url: string; error: Error }) => {
        const options = this.activeDownloads[url];
        if (options?.onError) {
          options.onError(error);
        }

        delete this.activeDownloads[url];
      }
    );
  }

  downloadFile(url: string, options?: DownloadOptions): void {
    const optionsNormalized = options ?? {};
    this.activeDownloads[url] = optionsNormalized;
    window.electron.download.file({
      url,
      filename: optionsNormalized.filename,
      showBadge: optionsNormalized.showBadge,
      showProgressBar: optionsNormalized.showProgressBar,
      overwrite: optionsNormalized.overwrite,
    });
  }
}
