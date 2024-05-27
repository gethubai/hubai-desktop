import { AppContext, Controller, ShortcutEditor, component } from '@hubai/core';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import ShortcutRegisterService from '../services/shortcutRegisterService';
import { IShortcutItem } from '../models/sidebarState';

export class ShortcutRegisterController extends Controller {
  constructor(
    private readonly appContext: AppContext,
    private readonly service: ShortcutRegisterService
  ) {
    super();
  }

  initView(): void {
    const sidebarHeaderToolbar = [
      {
        icon: 'add',
        id: 'shortcutRegister.add',
        title: 'Add new shortcut',
        onClick: () => {
          this.selectOrOpenWindow({
            id: generateUniqueId(),
            accelerator: '',
            name: 'New Shortcut',
          });
        },
      },
    ];

    this.service.setState({ headerToolBar: sidebarHeaderToolbar });
  }

  public selectOrOpenWindow = (item: IShortcutItem) => {
    let renderPane;
    const { id, name } = item;

    const shortcuts = this.service.storage.getAll();

    if (!this.appContext.services.editor.isOpened(id)) {
      renderPane = () => (
        <ShortcutEditor
          key={id}
          item={(shortcuts.find((s) => s.id === id) as IShortcutItem) ?? item}
        />
      );
    }

    this.appContext.services.editor.open({
      id,
      name,
      icon: 'record-keys',
      renderPane,
    });
  };

  public onContextMenuClick = (
    item: component.IMenuItemProps,
    selected: IShortcutItem
  ) => {
    switch (item.id) {
      case 'remove':
        this.service.removeShortcut(selected);
        break;
      default:
        break;
    }
  };
}
