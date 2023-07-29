import { IServerEventEmitter } from '../pubsub/models/eventEmitter';
import { IChatServerClient } from './chatServerClient';

export interface IChatTransport {
  eventEmitter: IServerEventEmitter;

  onConnection: (listener: (client: IChatServerClient) => void) => void;
}

// TODO: Move this
export class ServerListener {
  private listeners: Record<string, Array<(...args: any[]) => void>> = {};

  constructor() {
    this.listeners = {};
  }

  addListener = (event: string, listener: (...args: any[]) => void): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  };

  callListeners = (event: string, ...args: any[]): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((l) => l(...args));
  };

  removeListener = (
    event: string,
    listener: (...args: any[]) => void
  ): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  };
}
