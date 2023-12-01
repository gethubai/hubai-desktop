import { inject, injectable } from 'tsyringe';
import {
  IShortcutSubscription,
  IUserShortcut,
  IUserShortcutService,
  type IGlobalShortcutService
} from '@hubai/core';
import { EventEmitter } from '@hubai/core/esm/common/event';

@injectable()
export class UserShortcutService implements IUserShortcutService {
  private readonly shortcuts: IUserShortcut[];
  private readonly handlers: Record<string, Array<() => void>>;
  private readonly eventEmitter: EventEmitter;

  constructor(
    @inject('IGlobalShortcutService')
    private readonly globalShortcutService: IGlobalShortcutService
  ) {
    this.shortcuts = [];
    this.handlers = {};
    this.eventEmitter = new EventEmitter();
  }

  update = async (shortcut: IUserShortcut): Promise<boolean> => {
    const { id } = shortcut;

    const shortcutToUpdate = this.shortcuts.find((s) => s.id === id);

    if (!shortcutToUpdate) {
      console.error(`No shortcut found via id ${id}`);
      return false;
    }

    if (!this.globalShortcutService.isValid(shortcut.accelerator)) {
      console.error(
        `Failed to update shortcut ${shortcut.accelerator}, because it's not valid`
      );
      return false;
    }

    if (shortcutToUpdate.accelerator !== shortcut.accelerator) {
      const { accelerator } = shortcut;

      if (this.isRegistered(accelerator)) {
        console.error(
          `Failed to update shortcut ${accelerator}, because it's already registered by another application or shortcut`
        );
        return false;
      }

      const unregisterResult = this.globalShortcutService.unregister(
        shortcutToUpdate.accelerator
      );

      if (!unregisterResult) {
        console.error(
          `Failed to unregister shortcut ${shortcutToUpdate.accelerator}, because it's not registered`
        );
        return false;
      }

      const registerResult = await this.globalShortcutService.register(
        accelerator,
        () => this.handlers[accelerator]?.forEach((h) => h())
      );

      if (!registerResult) {
        console.error(
          `Failed to update shortcut ${accelerator}, because it's already registered by another application or shortcut`
        );
        return false;
      }

      shortcutToUpdate.accelerator = accelerator;
    }

    shortcutToUpdate.name = shortcut.name;

    this.eventEmitter.emit('shortcut-updated', shortcutToUpdate);

    return true;
  };

  public getOrCreate = async (
    shortcut: string | IUserShortcut,
    defaultShortcut: IUserShortcut
  ): Promise<IUserShortcut> => {
    let resultShortcut =
      typeof shortcut === 'string'
        ? this.getShortcuts().find((f) => f.id === shortcut)
        : shortcut;

    if (!resultShortcut || !this.isRegistered(resultShortcut.accelerator)) {
      await this.register(defaultShortcut);
      resultShortcut = defaultShortcut;
    }

    return resultShortcut!;
  };

  public register = async (shortcut: IUserShortcut): Promise<boolean> => {
    const { accelerator } = shortcut;

    if (!this.globalShortcutService.isValid(accelerator)) {
      console.error(
        `Failed to register shortcut ${accelerator}, because it's not valid`
      );
      return false;
    }

    const isRegistered = this.isRegistered(accelerator);

    if (!isRegistered) {
      this.handlers[accelerator] = [];

      const registrationResult = await this.globalShortcutService.register(
        accelerator,
        () => this.handlers[accelerator]?.forEach((h) => h())
      );

      if (!registrationResult) {
        console.error(
          `Failed to register shortcut ${accelerator}, because it's already registered by another application or shortcut`
        );
        return false;
      }

      this.shortcuts.push(shortcut);

      this.eventEmitter.emit('shortcut-added', shortcut);

      console.log(
        `Shortcut id ${shortcut.id} has been registered: ${shortcut.name} -> ${shortcut.accelerator}`
      );

      return true;
    }

    return false;
  };

  public unregister = async (id: string): Promise<boolean> => {
    const shortcut = this.shortcuts.find((s) => s.id === id);

    if (!shortcut) {
      console.error(`No shortcut found via id ${id}`);
      return false;
    }

    const { accelerator } = shortcut;

    const isRegistered = this.isRegistered(accelerator);

    if (isRegistered) {
      const unregistrationResult = await this.globalShortcutService.unregister(
        accelerator
      );

      if (!unregistrationResult) {
        console.error(
          `Failed to unregister shortcut ${accelerator}, because it's not registered`
        );
        return false;
      }

      console.log(
        `Shortcut id ${shortcut.id} has been removed: ${shortcut.name} -> ${shortcut.accelerator}`
      );

      delete this.handlers[accelerator];
      this.shortcuts.splice(this.shortcuts.indexOf(shortcut), 1);

      this.eventEmitter.emit('shortcut-removed', shortcut);
      return true;
    }

    return false;
  };

  public getShortcuts = (): IUserShortcut[] => {
    return this.shortcuts;
  };

  public isRegistered = (shortcut: string | IUserShortcut): boolean => {
    const shortcutId =
      typeof shortcut === 'string' ? shortcut : shortcut.accelerator;

    return this.getShortcuts().some((s) => s.accelerator === shortcutId);
  };

  public onShortcutPressed = (
    shortcut: string | IUserShortcut,
    callback: () => void
  ): IShortcutSubscription => {
    const shortcutId = typeof shortcut === 'string' ? shortcut : shortcut.accelerator;
    if (!this.handlers[shortcutId]) {
      throw new Error(`Shortcut ${shortcutId} is not registered`);
    }

    this.handlers[shortcutId].push(callback);

    const unsubscribe = () => {
      const shortcutHandlers = this.handlers[shortcutId];

      if (!shortcutHandlers) {
        return;
      }

      shortcutHandlers.splice(shortcutHandlers.indexOf(callback), 1);

      console.log(`Shortcut ${shortcutId} has been unsubscribed`);
    };

    return {
      unsubscribe,
    };
  };

  public onShortcutAdded = (
    callback: (shortcut: IUserShortcut) => void
  ): IShortcutSubscription => this.addSubscription('shortcut-added', callback);

  public onShortcutRemoved = (
    callback: (shortcut: IUserShortcut) => void
  ): IShortcutSubscription =>
    this.addSubscription('shortcut-removed', callback);

  public onShortcutUpdated = (
    callback: (shortcut: IUserShortcut) => void
  ): IShortcutSubscription =>
    this.addSubscription('shortcut-updated', callback);

  public addSubscription = (
    event: string,
    callback: (shortcut: IUserShortcut) => void
  ): IShortcutSubscription => {
    const unsubscribe = () => {
      this.eventEmitter.unsubscribe(event, callback);
    };

    this.eventEmitter.subscribe(event, callback);
    return {
      unsubscribe,
    };
  };
}
