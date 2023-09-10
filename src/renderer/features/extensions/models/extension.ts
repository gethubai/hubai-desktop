import { IActionBarItemProps } from '@hubai/core/esm/components';
import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';

export enum ExtensionEvent {
  onExtensionSettingsUpdated = 'extension.onSettingsUpdated',
  onExtensionUninstalled = 'extension.onUninstalled',
  onExtensionInstalled = 'extension.onInstalled',
}

export type LocalExtensionViewModel = LocalExtensionModel & {};

export interface IExtensionListState {
  extensions: LocalExtensionViewModel[];
  headerToolBar?: IActionBarItemProps[];
}

export class ExtensionListStateModel implements IExtensionListState {
  extensions: LocalExtensionViewModel[];

  headerToolBar?: IActionBarItemProps[];

  constructor(
    extensions: LocalExtensionViewModel[] = [],
    headerToolBar: IActionBarItemProps<any>[] = []
  ) {
    this.extensions = extensions;
    this.headerToolBar = headerToolBar;
  }
}
