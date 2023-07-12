import { AuxiliaryModel } from '@hubai/core';
import AuxiliaryBarService from 'mo/services/workbench/auxiliaryBarService';

class ChatAuxiliaryBarService extends AuxiliaryBarService {
  constructor() {
    super();
    this.state = new AuxiliaryModel();
  }
}

export default ChatAuxiliaryBarService;
