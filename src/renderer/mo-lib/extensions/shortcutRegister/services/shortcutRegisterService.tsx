import { IUserShortcutService, react } from '@hubai/core';
import { container } from 'tsyringe';
import { IShortcutItem, ShortcutRegisterState } from '../models/sidebarState';
import { IShortcutStorage, ShortcutLocalStorage } from './shortcutStorages';

const { Component } = react;

export default class ShortcutRegisterService extends Component<ShortcutRegisterState> {
  protected state: ShortcutRegisterState;

  public storage: IShortcutStorage;

  private readonly userShortcutService: IUserShortcutService;

  constructor() {
    super();

    this.storage = new ShortcutLocalStorage();

    this.state = {
      shortcuts: [],
    };

    this.userShortcutService = container.resolve<IUserShortcutService>(
      'IUserShortcutService'
    );

    this.initShortcuts();
  }

  initShortcuts = async (): Promise<void> => {
    const shortcuts = this.storage.getAll();

    this.userShortcutService.onShortcutAdded((shortcut) => {
      this.addShortcut(shortcut);
    });

    this.userShortcutService.onShortcutRemoved((shortcut) => {
      this.remove(shortcut);
    });

    this.userShortcutService.onShortcutUpdated((shortcut) => {
      this.update(shortcut);
    });

    Array.from(shortcuts).forEach((shortcut) => {
      const registered = this.userShortcutService.register(shortcut);
      if (!registered) {
        this.storage.remove(shortcut.id);
      }
    });
  };

  addShortcut = (session: IShortcutItem): void => {
    if (!this.storage.getAll().some((s) => s.id === session.id)) {
      this.storage.add(session);
    }

    this.updateItems();
  };

  removeShortcut = (session: IShortcutItem): void => {
    this.userShortcutService.unregister(session.id);
  };

  remove = (session: IShortcutItem): void => {
    this.storage.remove(session.id);

    this.updateItems();
  };

  update = (session: IShortcutItem): void => {
    this.storage.update(session);

    this.updateItems();
  };

  updateItems = (): void => {
    this.setState({
      shortcuts: this.storage.getAll(),
    });
  };
}
