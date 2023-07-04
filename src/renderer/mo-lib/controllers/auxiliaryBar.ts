import 'reflect-metadata';
import { Controller } from '@hubai/core/esm/react/controller';
import { inject, injectable } from 'tsyringe';
import type { IAuxiliaryBarService } from '@hubai/core/esm/services';
import { AuxiliaryEventKind } from '@hubai/core/esm/model';
import type { UniqueId } from '@hubai/core/esm/common/types';

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
