import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import {
  isBlobWebAPI,
  isBuffer,
  isFileWebAPI,
} from 'renderer/features/chat/sdk/fileUtils';
import { HttpRequestOptions, HttpResponse, IHttpClient } from '../httpClient';

export class AxiosHttpClient implements IHttpClient {
  private readonly httpClient: AxiosInstance;

  constructor(
    config?: CreateAxiosDefaults,
    configure?: (client: AxiosInstance) => void
  ) {
    this.httpClient = axios.create({
      timeout: 6000,
      withCredentials: false,
      ...(config ?? {}),
    });

    configure?.(this.httpClient);
  }

  get = async <TResponse>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>> => {
    return this.httpClient
      .get<TResponse>(url, this.getOptions(options))
      .then(this.getResponseData<TResponse>);
  };

  post = async <TResponse>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>> => {
    return this.httpClient
      .post<TResponse>(url, this.getOptions(options))
      .then(this.getResponseData<TResponse>);
  };

  put = async <TResponse>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>> => {
    return this.httpClient
      .put<TResponse>(url, this.getOptions(options))
      .then(this.getResponseData<TResponse>);
  };

  delete = async <TResponse>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>> => {
    return this.httpClient
      .delete<TResponse>(url, this.getOptions(options))
      .then(this.getResponseData<TResponse>);
  };

  uploadFile = async <TResponse>(
    url: string,
    fileUri: string | Buffer | File | Blob,
    name?: string,
    contentType?: string
  ): Promise<HttpResponse<TResponse>> => {
    const data = new FormData();

    if (isBuffer(fileUri) || isFileWebAPI(fileUri) || isBlobWebAPI(fileUri)) {
      if (name) {
        data.append('file', fileUri as any, name);
      } else data.append('file', fileUri as any);
    } else {
      data.append('file', {
        uri: fileUri,
        name: name || (fileUri as string).split('/').reverse()[0],
        contentType,
        type: contentType,
      } as any);
    }

    return this.httpClient
      .post<TResponse>(url, data)
      .then(this.getResponseData<TResponse>);
  };

  getOptions = (options?: HttpRequestOptions): AxiosRequestConfig => {
    if (!options) return {};

    return {
      headers: options?.headers as any,
      params: options?.params,
      data: options?.body,
    };
  };

  getResponseData = async <TResponse>(
    response: AxiosResponse
  ): Promise<HttpResponse<TResponse>> => {
    const result = response.data as TResponse;
    if (response.status >= 400) {
      const error = `Request failed with status ${response.status}: ${response.statusText}`;
      console.error('ResponseErr', error, '\nrequest response:\n', result);
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error,
        result,
      };
    }
    return {
      success: true,
      result,
      status: response.status,
      statusText: response.statusText,
    };
  };
}
