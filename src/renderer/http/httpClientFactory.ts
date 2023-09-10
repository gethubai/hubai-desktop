import { injectable } from 'tsyringe';
import { IHttpClient } from './httpClient';

export enum BuiltInHttpClient {
  packageApi = 'packageApi',
  downloadApi = 'downloadApi',
}

export interface IHttpClientFactory {
  addHttpClient(name: string, httpClient: IHttpClient): void;

  createHttpClient(name: string | BuiltInHttpClient): IHttpClient;
}

@injectable()
export class HttpClientFactory implements IHttpClientFactory {
  private readonly httpClients: Record<string, IHttpClient> = {};

  addHttpClient = (name: string, httpClient: IHttpClient): void => {
    const nameNormalized = name.toLowerCase();
    if (this.httpClients[nameNormalized])
      throw new Error(`HttpClient with name ${name} already exists`);

    this.httpClients[nameNormalized] = httpClient;
    console.log(`HttpClient with name ${name} has been added`);
  };

  createHttpClient = (name: string | BuiltInHttpClient): IHttpClient => {
    const nameNormalized = name.toLowerCase();
    const httpClient = this.httpClients[nameNormalized];

    if (!httpClient)
      throw new Error(
        `HttpClient with name ${name} does not exist: ${JSON.stringify(
          this.httpClients
        )}`
      );

    return httpClient;
  };
}
