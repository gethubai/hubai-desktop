import { HttpResponse } from './http';

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>;
}
