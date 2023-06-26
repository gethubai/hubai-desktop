import 'reflect-metadata';
import { Controller } from '@allai/core/esm/react/controller';
import { inject, injectable } from 'tsyringe';
import type { IAuxiliaryBarService } from '@allai/core/esm/services';
import { AuxiliaryEventKind } from '@allai/core/esm/model';
import type { UniqueId } from '@allai/core/esm/common/types';

export interface IAuxiliaryController {
  onClick?: (key: UniqueId) => void;
}

@injectable()
export class AuxiliaryController
  extends Controller
  implements IAuxiliaryController
{
  constructor(
    @inject('IAuxiliaryBarService')
    private auxiliaryService: IAuxiliaryBarService
  ) {
    super();
  }

  public initView = () => {};

  public onClick = (key: UniqueId) => {
    this.auxiliaryService.setActive(
      this.auxiliaryService.getState().current === key ? undefined : key
    );
    this.emit(AuxiliaryEventKind.onTabClick, key);
  };
}
