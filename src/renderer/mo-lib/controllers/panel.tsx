import { inject, injectable } from 'tsyringe';
import React from 'react';
import { IActionBarItemProps } from '@hubai/core/esm/components/actionBar';
import { type IPanelService, PanelEvent, Controller } from '@hubai/core';
import { type IMonacoService } from '@hubai/core/esm/monaco/monacoService';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { QuickTogglePanelAction } from 'mo/monaco/quickTogglePanelAction';
import Output from 'mo/workbench/panel/output';
import { type IBuiltinService } from 'mo/services/builtinService';

export interface IPanelController extends Partial<Controller> {
  onTabChange?(key: UniqueId): void;
  onToolbarClick?(e: React.MouseEvent, item: IActionBarItemProps): void;
  onClose?(key: UniqueId): void;
}

@injectable()
export class PanelController extends Controller implements IPanelController {
  constructor(
    @inject('IPanelService') private panelService: IPanelService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IMonacoService') private monacoService: IMonacoService
  ) {
    super();
  }

  public initView() {
    const {
      builtInOutputPanel,
      builtInPanelToolbox,
      builtInPanelToolboxResize,
    } = this.builtinService.getModules();
    if (builtInOutputPanel) {
      const output = builtInOutputPanel;
      output.renderPane = (item) => (
        <Output
          onUpdateEditorIns={(instance) => {
            // Please notice the problem about memory out
            // 'Cause we didn't dispose the older instance
            item.outputEditorInstance = instance;
          }}
          {...item}
        />
      );
      this.panelService.add(output);
      this.panelService.setActive(output.id);
    }

    const toolbox = [builtInPanelToolboxResize, builtInPanelToolbox].filter(
      Boolean
    ) as IActionBarItemProps[];

    this.panelService.setState({
      toolbox,
    });
  }

  public readonly onTabChange = (key: UniqueId): void => {
    if (key) {
      this.panelService.setActive(key);
    }
    this.emit(PanelEvent.onTabChange, key);
  };

  public readonly onClose = (key: UniqueId) => {
    if (key) {
      this.emit(PanelEvent.onTabClose, key);
    }
  };

  public readonly onToolbarClick = (
    e: React.MouseEvent,
    item: IActionBarItemProps
  ): void => {
    const { PANEL_TOOLBOX_CLOSE, PANEL_TOOLBOX_RESIZE } =
      this.builtinService.getConstants();
    if (item.id === PANEL_TOOLBOX_CLOSE) {
      this.monacoService.commandService.executeCommand(
        QuickTogglePanelAction.ID
      );
    } else if (item.id === PANEL_TOOLBOX_RESIZE) {
      this.panelService.toggleMaximize();
    }
    this.emit(PanelEvent.onToolbarClick, e, item);
  };
}
