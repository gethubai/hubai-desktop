import { container } from 'tsyringe';
import {
  BuiltInHttpClient,
  HttpClientFactory,
  type IHttpClientFactory,
} from './httpClientFactory';
import { AxiosHttpClient } from './axios/axiosHttpClient';

container.registerSingleton<IHttpClientFactory>(
  'IHttpClientFactory',
  HttpClientFactory
);

const httpClientFactory =
  container.resolve<IHttpClientFactory>('IHttpClientFactory');

const apiBaseUrl = process.env.API_BASE_URL;
// const apiBaseUrl = 'https://localhost:7216/api';
httpClientFactory.addHttpClient(
  BuiltInHttpClient.packageApi,
  new AxiosHttpClient({
    baseURL: `${apiBaseUrl}/package`,
  })
);

httpClientFactory.addHttpClient(
  BuiltInHttpClient.downloadApi,
  new AxiosHttpClient({ baseURL: `${apiBaseUrl}/download` })
);
