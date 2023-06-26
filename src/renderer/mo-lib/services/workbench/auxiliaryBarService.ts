import React from 'react';
import { container, injectable } from 'tsyringe';
import { Component } from '@allai/core/esm/react/component';
import {
  AuxiliaryEventKind,
  AuxiliaryModel,
  IAuxiliaryBar,
  IAuxiliaryBarMode,
  IAuxiliaryData,
} from '@allai/core/esm/model';
import type { UniqueId } from '@allai/core/esm/common/types';
import { IAuxiliaryBarService } from '@allai/core';

@injectable()
class AuxiliaryBarService
  extends Component<IAuxiliaryBar>
  implements IAuxiliaryBarService
{
  public state: IAuxiliaryBar;

  constructor() {
    super();
    this.state = container.resolve(AuxiliaryModel);
  }

  addAuxiliaryBar = (tabs: IAuxiliaryData | IAuxiliaryData[]) => {
    const next = Array.isArray(tabs) ? tabs : [tabs];
    this.setState({
      data: this.state.data.concat(next),
    });
  };

  setActive = (current: UniqueId | undefined) => {
    this.setState({ current });
  };

  setChildren = (children: React.ReactNode) => {
    this.setState({
      children,
    });
  };

  setMode = (
    mode:
      | IAuxiliaryBarMode
      | ((preState: IAuxiliaryBarMode) => IAuxiliaryBarMode)
  ) => {
    if (typeof mode === 'string') {
      this.setState({
        mode,
      });

      return mode;
    }

    const nextMode = mode(this.state.mode);
    this.setState({
      mode: nextMode,
    });
    return nextMode;
  };

  reset = () => {
    this.setState(container.resolve(AuxiliaryModel));
  };

  // ====== The belows for subscribe activity bar events ======
  public onTabClick(callback: (key: UniqueId) => void) {
    this.subscribe(AuxiliaryEventKind.onTabClick, callback);
  }

  getCurrentTab = () => {
    const { current, data } = this.getState();
    const tab = data?.find((item) => item.key === current);
    return tab;
  };
}

export default AuxiliaryBarService;
