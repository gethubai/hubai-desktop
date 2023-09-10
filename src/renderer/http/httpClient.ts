export type HttpResponse<TResult> = {
  result: TResult;
  success: boolean;
  status: number;
  statusText: string;
  error?: string;
};

export type HttpRequestOptions = {
  anonymous?: boolean;
  headers?: HeadersInit;
  body?: any;
  params?: any;
};

export type DownloadHttpRequestOptions = HttpRequestOptions & {
  onProgress?: (progress: {
    percent: number;
    transferredBytes: number;
    totalBytes: number;
  }) => void;
};

export interface IHttpClient {
  get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  post<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  put<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  delete<T>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
  uploadFile<T>(
    url: string,
    fileUri: string | Buffer | File | Blob,
    name?: string,
    contentType?: string
  ): Promise<HttpResponse<T>>;
}
