/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { inject, injectable } from 'tsyringe';
import { type ISidebarService, Controller } from '@hubai/core';

export type ISideBarController = Partial<Controller>;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public readonly onClick = (event: React.MouseEvent) => {};
}
