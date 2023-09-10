import { DownloadCompleted, DownloadProgress } from './models';

export type DownloadOptions = {
  filename?: string;
  overwrite?: boolean;
  showProgressBar?: boolean;
  showBadge?: boolean;

  onProgress?: (progress: DownloadProgress) => void;

  onStarted?: () => void;
  onCancel?: () => void;
  onCompleted?: (file: DownloadCompleted) => void;
  onError?: (error: Error) => void;
};

export interface IDownloadManager {
  downloadFile(url: string, options?: DownloadOptions): void;
}
