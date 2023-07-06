import React from 'react';
import { inject, injectable } from 'tsyringe';
import { type IExplorerService, Controller } from '@hubai/core';
import { type IBuiltinService } from 'mo/services/builtinService';

export interface IOutlineController extends Partial<Controller> {}

@injectable()
export class OutlineController
  extends Controller
  implements IOutlineController
{
  constructor(
    @inject('IExplorerService') private explorerService: IExplorerService,
    @inject('IBuiltinService') private builtinService: IBuiltinService
  ) {
    super();
  }

  public initView() {
    const { builtInExplorerOutlinePanel } = this.builtinService.getModules();

    if (builtInExplorerOutlinePanel) {
      this.explorerService.addPanel(builtInExplorerOutlinePanel);
    }
  }

  public readonly onClick = (event: React.MouseEvent) => {};
}
