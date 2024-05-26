import { container, injectable } from 'tsyringe';
import { Component } from '@hubai/core/esm/react';
import { ID_APP } from '@hubai/core/esm/common/id';
import {
  ILayout,
  Position,
  LayoutModel,
  MenuBarMode,
  LayoutEvents,
} from '@hubai/core/esm/model/workbench/layout';
import { MenuBarEvent } from '@hubai/core/esm/model/workbench/menuBar';
import { ILayoutService } from '@hubai/core';

@injectable()
class LayoutService extends Component<ILayout> implements ILayoutService {
  protected state: ILayout;

  private _container!: HTMLElement | null;

  constructor() {
    super();
    this.state = container.resolve(LayoutModel);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public onWorkbenchDidMount(callback: Function): void {
    this.subscribe(LayoutEvents.OnWorkbenchDidMount, callback);
  }

  public get container() {
    // Make sure to get the latest dom element.
    this._container = document.getElementById(ID_APP) || document.body;
    return this._container;
  }

  public toggleMenuBarVisibility(): boolean {
    const { menuBar } = this.state;
    const wasHidden = menuBar.hidden;
    this.setState({ menuBar: { ...menuBar, hidden: !wasHidden } });
    return !wasHidden;
  }

  public togglePanelVisibility(): boolean {
    const { panel } = this.state;
    const wasHidden = panel.hidden;
    this.setState({ panel: { ...panel, hidden: !wasHidden } });
    return !wasHidden;
  }

  public toggleSidebarVisibility(): boolean {
    const { sidebar } = this.state;
    const wasHidden = sidebar.hidden;
    this.setState({ sidebar: { ...sidebar, hidden: !wasHidden } });
    return !wasHidden;
  }

  public toggleActivityBarVisibility(): boolean {
    const { activityBar } = this.state;
    const wasHidden = activityBar.hidden;
    this.setState({ activityBar: { ...activityBar, hidden: !wasHidden } });
    return !wasHidden;
  }

  public toggleStatusBarVisibility(): boolean {
    const { statusBar } = this.state;
    const wasHidden = statusBar.hidden;
    this.setState({ statusBar: { ...statusBar, hidden: !wasHidden } });
    return !wasHidden;
  }

  public setSideBarPosition(position: keyof typeof Position): void {
    const { sidebar } = this.state;
    const { position: prePos } = sidebar;
    if (prePos !== position) {
      this.setState({
        sidebar: { position, hidden: false },
      });
    }
  }

  public togglePanelMaximized(): boolean {
    const panelViewState = this.state.panel;
    this.setState({
      panel: {
        ...panelViewState,
        panelMaximized: !panelViewState.panelMaximized,
      },
    });
    return !panelViewState.panelMaximized;
  }

  public setPaneSize(splitPanePos: (number | string)[]): void {
    this.setState({ splitPanePos });
  }

  public setHorizontalPaneSize(
    horizontalSplitPanePos: (number | string)[]
  ): void {
    this.setState({ horizontalSplitPanePos });
  }

  public setGroupSplitSize(groupSplitPos: (string | number)[]): void {
    this.setState({
      groupSplitPos,
    });
  }

  public setMenuBarMode(mode: keyof typeof MenuBarMode): void {
    const { menuBar } = this.state;
    const { mode: preMode } = menuBar;
    if (preMode !== mode) {
      this.setState({ menuBar: { ...menuBar, mode, hidden: false } });
      this.emit(MenuBarEvent.onChangeMode, mode);
    }
  }

  public getMenuBarMode(): keyof typeof MenuBarMode {
    const { menuBar } = this.state;
    return menuBar.mode;
  }

  public setEditorGroupDirection(
    direction: MenuBarMode | ((prev: MenuBarMode) => MenuBarMode)
  ) {
    if (typeof direction === 'function') {
      this.setState({
        editorGroupDirection: direction(this.state.editorGroupDirection),
      });
    } else {
      this.setState({
        editorGroupDirection: direction,
      });
    }
  }

  public setAuxiliaryBar(hidden: boolean | ((preState: boolean) => boolean)) {
    if (typeof hidden === 'boolean') {
      this.setState({
        auxiliaryBar: { hidden },
      });

      return hidden;
    }

    const nextHidden = hidden(this.state.auxiliaryBar.hidden);
    this.setState({
      auxiliaryBar: { hidden: nextHidden },
    });

    return nextHidden;
  }

  public reset() {
    this.setState({
      splitPanePos: ['300px', 'auto'],
      horizontalSplitPanePos: ['70%', 'auto'],
      activityBar: { hidden: false },
      panel: { hidden: false, panelMaximized: false },
      statusBar: { hidden: false },
      sidebar: { hidden: false, position: Position.left },
      menuBar: { hidden: false, mode: MenuBarMode.vertical },
    });
  }
}

export default LayoutService;
