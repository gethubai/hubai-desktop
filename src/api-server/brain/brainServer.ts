export interface IBrainServer {
  start(hostUrl: string): Promise<void>;
}
