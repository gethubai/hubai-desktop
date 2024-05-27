import React from 'react';
import { container, inject, injectable } from 'tsyringe';
import { StandaloneEditor } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditor';
import { cloneDeepWith, cloneDeep } from 'lodash';
import pickBy from 'lodash/pickBy';
import { Component } from '@hubai/core/esm/react';
import {
  IOutput,
  IPanel,
  IPanelItem,
  PanelEvent,
  PanelModel,
} from '@hubai/core/esm/model/workbench/panel';

import { searchById } from '@hubai/core/esm/common/utils';
import { IActionBarItemProps } from '@hubai/core/esm/components/actionBar';
import { IPanelService, type ILayoutService } from '@hubai/core';
import logger from '@hubai/core/esm/common/logger';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { type IBuiltinService } from '../builtinService';

@injectable()
class PanelService extends Component<IPanel> implements IPanelService {
  protected state: IPanel;

  constructor(
    @inject('ILayoutService') private layoutService: ILayoutService,
    @inject('IBuiltinService') private builtinService: IBuiltinService
  ) {
    super();
    this.state = container.resolve(PanelModel);
  }

  private updateOutputProperty(
    data: Partial<IPanelItem<string>>
  ): IPanelItem | undefined {
    const { PANEL_OUTPUT } = this.builtinService.getConstants();
    const truthData = pickBy(data, (item) => item !== undefined);
    const panel = this.getPanel(PANEL_OUTPUT!);
    if (panel) {
      const updatedPanel = { ...panel, ...truthData };
      return this.update(updatedPanel);
    }
    return undefined;
  }

  public get outputEditorInstance() {
    const { PANEL_OUTPUT } = this.builtinService.getConstants();
    const outputPane: IOutput | undefined = this.state.data?.find(
      searchById(PANEL_OUTPUT)
    );
    return outputPane?.outputEditorInstance;
  }

  public setActive(id: UniqueId): void {
    const panel = this.getPanel(id);
    if (panel) {
      this.open(panel);
    } else {
      logger.error(
        `There is no panel found in data via ${id}. If you want to open a brand-new panel, please use the open method`
      );
    }
  }

  public toggleMaximize(): void {
    const { PANEL_TOOLBOX_RESIZE } = this.builtinService.getConstants();
    const { builtInPanelToolboxResize, builtInPanelToolboxReStore } =
      this.builtinService.getModules();
    const { toolbox = [] } = this.state;
    if (builtInPanelToolboxResize && builtInPanelToolboxReStore) {
      const resizeBtnIndex = toolbox?.findIndex(
        searchById(PANEL_TOOLBOX_RESIZE)
      );
      const resizeBtn = toolbox[resizeBtnIndex];
      if (resizeBtn) {
        const panelMaximized = this.layoutService.togglePanelMaximized();

        toolbox[resizeBtnIndex] = panelMaximized
          ? builtInPanelToolboxReStore
          : builtInPanelToolboxResize;
      }
    }
  }

  public open(data: IPanelItem<any>): void {
    const { data: stateData = [] } = this.state;
    let current = cloneDeep(data);
    const index = stateData.findIndex(searchById(current.id));
    if (index > -1) {
      current = stateData[index];
    } else {
      // Add the new panel item
      this.add(current);
    }

    this.setState({
      current,
    });
  }

  public getPanel(id: UniqueId): IPanelItem<any> | undefined {
    const { data = [] } = this.state;
    return cloneDeepWith(data.find(searchById(id)), (value) => {
      // prevent the browser from OOM
      // because when cloneDeep the StandaloneEditor class, it'll get infinity loop in
      // https://unpkg.com/monaco-editor@0.23.0/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase.js#L398
      // class PieceTreeBase.getOffsetAt.while
      if (
        value &&
        typeof value === 'object' &&
        value instanceof StandaloneEditor
      ) {
        return value;
      }

      return undefined;
    });
  }

  public getOutputValue() {
    const { PANEL_OUTPUT = '' } = this.builtinService.getConstants();
    const outputPanel = this.getPanel(PANEL_OUTPUT);
    return outputPanel?.data || '';
  }

  /**
   * Onyl support to update several properties
   */
  public updateOutput(data: Partial<IPanelItem>): IPanelItem | undefined {
    const { title, name, sortIndex, active, closable, editable } = data;
    return this.updateOutputProperty({
      title,
      name,
      sortIndex,
      active,
      closable,
      editable,
    });
  }

  public appendOutput(content: string): void {
    const outputValue = this.getOutputValue();
    this.updateOutputProperty({
      data: outputValue + content,
    });
    this.outputEditorInstance?.setValue(outputValue + content);
  }

  public cleanOutput(): void {
    this.outputEditorInstance?.setValue('');
  }

  public add(data: IPanelItem | IPanelItem[]) {
    let original = this.state.data || [];
    const cloneData = cloneDeep(data);
    if (Array.isArray(cloneData)) {
      original = original.concat(cloneData);
    } else {
      original.push(cloneData);
    }
    this.setState({
      data: original,
    });
  }

  public update(data: IPanelItem): IPanelItem | undefined {
    const panes = this.state.data || [];
    const targetIndex = panes?.findIndex(searchById(data.id));
    if (targetIndex !== undefined && targetIndex > -1) {
      Object.assign(panes[targetIndex], data);
      this.setState({
        data: [...panes],
      });
      return panes[targetIndex];
    }
    logger.error(`There is no panel found in data via the ${data.id}`);
    return undefined;
  }

  public remove(id: UniqueId): IPanelItem | undefined {
    const { data } = this.state;

    const targetIndex = data?.findIndex(searchById(id));
    if (targetIndex !== undefined && targetIndex > -1) {
      const result = data?.splice(targetIndex, 1) || [];
      this.setState({
        data,
      });
      return result[0];
    }
    logger.error(`There is no panel found in data via the ${id}`);
    return undefined;
  }

  public reset(): void {
    this.setState({
      data: [],
      current: null,
      toolbox: [],
    });
    this.cleanOutput();
  }

  public onTabChange(callback: (key: UniqueId) => void) {
    this.subscribe(PanelEvent.onTabChange, callback);
  }

  public onToolbarClick(
    callback: (e: React.MouseEvent, item: IActionBarItemProps) => void
  ) {
    this.subscribe(PanelEvent.onToolbarClick, callback);
  }

  public onTabClose(callback: (key: UniqueId) => void) {
    this.subscribe(PanelEvent.onTabClose, callback);
  }
}

export default PanelService;
