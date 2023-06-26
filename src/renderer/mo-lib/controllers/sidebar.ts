import React from 'react';
import { inject, injectable } from 'tsyringe';
import { type ISidebarService, Controller } from '@allai/core';

export interface ISideBarController extends Partial<Controller> {}

@injectable()
export class SidebarController
  extends Controller
  implements ISideBarController
{
  constructor(
    @inject('ISidebarService') private sidebarService: ISidebarService
  ) {
    super();
  }

  public initView() {}

  public readonly onClick = (event: React.MouseEvent) => {};
}
