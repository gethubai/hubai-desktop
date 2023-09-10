import { IHttpClient } from 'renderer/http/httpClient';
import { container } from 'tsyringe';
import {
  BuiltInHttpClient,
  IHttpClientFactory,
} from 'renderer/http/httpClientFactory';
import { PackageStoreItem } from './models/packageStoreItem';

export type HomepagePackages = {
  brains: PackageStoreItem[];
  extensions: PackageStoreItem[];
  [key: string]: PackageStoreItem[];
};

export type SearchPackageFilter = {
  search?: string;
  packageType?: string;
  sortBy?: string;
};

export class PackageStoreHttpApi {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = container
      .resolve<IHttpClientFactory>('IHttpClientFactory')
      .createHttpClient(BuiltInHttpClient.packageApi);
  }

  getHomepagePackages = async (): Promise<HomepagePackages> => {
    return this.httpClient
      .get<HomepagePackages>('/homePage')
      .then((res) => res.result);
  };

  searchPackages = async (
    filters: SearchPackageFilter
  ): Promise<PackageStoreItem[]> => {
    return this.httpClient
      .get<PackageStoreItem[]>('', { params: filters })
      .then((res) => res.result);
  };
}

const packageStoreApi = new PackageStoreHttpApi();

export default packageStoreApi;
