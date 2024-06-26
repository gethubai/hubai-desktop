import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'HubAI',
      submenu: [
        {
          label: 'About HubAI',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide HubAI',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://hubai.app');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/gethubai/hubai-desktop');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal(
              'https://github.com/gethubai/hubai-desktop/issues'
            );
          },
        },

        { type: 'separator' },
        {
          label: 'Discord',
          click() {
            shell.openExternal('https://discord.gg/PUDxddr8cE');
          },
        },
        {
          label: 'X (Twitter)',
          click() {
            shell.openExternal('https://twitter.com/hubaiapp');
          },
        },
        {
          label: 'Instagram',
          click() {
            shell.openExternal('https://instagram.com/hubaiapp');
          },
        },
        {
          label: 'Facebook',
          click() {
            shell.openExternal('https://fb.com/hubaiapp');
          },
        },
        {
          label: 'YouTube',
          click() {
            shell.openExternal('https://youtube.com/@hubaiapp');
          },
        },
        {
          label: 'Reddit',
          click() {
            shell.openExternal('https://www.reddit.com/r/hubai');
          },
        },
      ],
    };

    const subMenuView = subMenuViewDev;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: () => {
              this.mainWindow.webContents.reload();
            },
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () => {
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            },
          },
          {
            label: 'Toggle &Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: () => {
              this.mainWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://hubai.app');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://github.com/gethubai/hubai-desktop');
            },
          },
          {
            label: 'GitHub',
            click() {
              shell.openExternal('https://github.com/gethubai/hubai-desktop');
            },
          },
          { type: 'separator' },
          {
            label: 'Discord',
            click() {
              shell.openExternal('https://discord.gg/PUDxddr8cE');
            },
          },
          {
            label: 'X (Twitter)',
            click() {
              shell.openExternal('https://twitter.com/hubaiapp');
            },
          },
          {
            label: 'Instagram',
            click() {
              shell.openExternal('https://instagram.com/hubaiapp');
            },
          },
          {
            label: 'Facebook',
            click() {
              shell.openExternal('https://fb.com/hubaiapp');
            },
          },
          {
            label: 'YouTube',
            click() {
              shell.openExternal('https://youtube.com/@hubaiapp');
            },
          },
          {
            label: 'Reddit',
            click() {
              shell.openExternal('https://www.reddit.com/r/hubai');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
