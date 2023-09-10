export type DownloadProgress = {
  percent: number;
  transferredBytes: number;
  totalBytes: number;
};

export type DownloadCompleted = {
  originalFileName: string;
  filename: string;
  path: string;
  fileSize: number;
  mimeType: string;
  url: string;
};
