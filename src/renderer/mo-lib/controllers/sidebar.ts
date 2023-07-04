import React from 'react';
import { inject, injectable } from 'tsyringe';
import { type ISidebarService, Controller } from '@hubai/core';

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
