import { injectable } from 'tsyringe';
import {
  IGlobalShortcut,
  IGlobalShortcutRegistrationOptions,
  IGlobalShortcutService,
} from '@hubai/core';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

type ShortcutHandler = {
  id: string;
  handler: () => void;
};

@injectable()
export class GlobalShortcutService implements IGlobalShortcutService {
  private readonly shortcuts: IGlobalShortcut[];

  private handlers: Record<string, ShortcutHandler[]>;

  constructor() {
    this.shortcuts = [];
    this.handlers = {};

    window.electron.ipcRenderer.on(
      'global-shortcut-pressed',
      this.onShortcutPressed.bind(this) as any
    );
  }

  onShortcutPressed = (accelerator: string): void => {
    const handlers = this.handlers[accelerator];

    if (!handlers) {
      console.error(`No handlers for accelerator ${accelerator}`);
      return;
    }

    handlers.forEach((h) => h.handler());
  };

  register = async (
    accelerator: string,
    callback: () => void,
    options?: IGlobalShortcutRegistrationOptions
  ): Promise<string | undefined> => {
    const id = options?.id ?? generateUniqueId();

    const isRegistered = this.isRegistered(accelerator);

    if (!isRegistered) {
      const isRegisteredOnApp =
        await window.electron.globalShortcut.isRegistered(accelerator);

      if (isRegisteredOnApp) {
        this.shortcuts.push({
          accelerator,
          enabled: true,
        });
      } else {
        const registrationResult =
          await window.electron.globalShortcut.register(accelerator);

        if (!registrationResult) {
          console.error(
            `Failed to register shortcut ${accelerator}, because it's already registered by another application`
          );

          return undefined;
        }

        this.shortcuts.push({
          accelerator,
          enabled: true,
        });
      }
    }

    if (!this.handlers[accelerator]) {
      this.handlers[accelerator] = [];
    }

    if (this.handlers[accelerator].some((h) => h.id === id)) {
      console.error(
        `Shortcut ${accelerator} already has a handler with id ${id}`
      );
      return undefined;
    }

    this.handlers[accelerator].push({
      id,
      handler: callback,
    });

    return id;
  };
  unregister = async (acceleratorId: string): Promise<boolean> => {
    const res = await window.electron.globalShortcut.unregister(acceleratorId);

    if (res) {
      delete this.handlers[acceleratorId];
    }

    return true;
  };
  isRegistered = (accelerator: string): boolean => {
    return this.shortcuts.some((s) => s.accelerator === accelerator);
  };
  getRegistered = (): IGlobalShortcut[] => {
    return this.shortcuts;
  };
  unregisterAll = (): void => {
    // TODO: Implement
    throw new Error('Method not implemented.');
  };

  isValid = (accelerator: string): boolean => {
    // TODO: Validate the possible keys

    return typeof accelerator === 'string' && accelerator.trim().length > 0;
  };
}
