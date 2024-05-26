import { AuxiliaryEventKind, Controller, UniqueId } from '@hubai/core';
import ChatAuxiliaryBarService from '../services/chatAuxiliaryBarService';

export interface IChatAuxiliaryBarController {
  onClick?: (key: UniqueId) => void;
}

export class ChatAuxiliaryBarController
  extends Controller
  implements IChatAuxiliaryBarController
{
  constructor(private auxiliaryService: ChatAuxiliaryBarService) {
    super();
  }

  public initView = () => {
    /* empty */
  };

  public onClick = (key: UniqueId) => {
    this.auxiliaryService.setActive(
      this.auxiliaryService.getState().current === key ? undefined : key
    );
    this.emit(AuxiliaryEventKind.onTabClick, key);
  };
}
