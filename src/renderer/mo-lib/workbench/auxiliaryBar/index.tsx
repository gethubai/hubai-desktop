import { container } from 'tsyringe';
import { Controller, connect } from '@hubai/core/esm/react';
import { IAuxiliaryBarService } from '@hubai/core';
import { IAuxiliaryController } from 'mo/controllers';
import AuxiliaryBarView from './auxiliaryBar';
import AuxiliaryBarTabView from './auxiliaryBarTab';

const auxiliaryService = container.resolve<IAuxiliaryBarService>(
  'IAuxiliaryBarService'
);
const auxiliaryController = container.resolve<IAuxiliaryController>(
  'IAuxiliaryController'
);

const AuxiliaryBar = connect(auxiliaryService, AuxiliaryBarView);

const AuxiliaryBarTab = connect(
  auxiliaryService,
  AuxiliaryBarTabView,
  auxiliaryController as Controller
);

export { AuxiliaryBar, AuxiliaryBarTab };
