import { IShortcutItem } from '../models/sidebarState';

export interface IShortcutStorage {
  add(item: IShortcutItem): void;
  getAll(): IShortcutItem[];
  update(item: IShortcutItem): void;
  remove(id: string): void;
}

const storageKey = 'shortcuts';
export class ShortcutLocalStorage implements IShortcutStorage {
  add(item: IShortcutItem): void {
    const items = this.getAll();
    items.push(item);

    this.setItems(items);
  }

  getAll(): IShortcutItem[] {
    const items = localStorage.getItem(storageKey);
    if (!items) return [];

    return JSON.parse(items);
  }

  update(item: IShortcutItem): void {
    const items = this.getAll();
    const index = items.findIndex((c) => c.id === item.id);
    if (index === -1) return;

    items[index] = item;

    this.setItems(items);
  }

  setItems(items: IShortcutItem[]): void {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  remove(id: string): void {
    const items = this.getAll();
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) return;

    items.splice(index, 1);

    this.setItems(items);
  }
}
