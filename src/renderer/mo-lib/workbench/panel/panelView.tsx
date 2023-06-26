import { container } from 'tsyringe';
import { Controller, connect } from '@allai/core/esm/react';
import { IPanelService } from '@allai/core/esm/services';
import { IPanelController } from 'mo/controllers';
import Panel from './panel';

const panelService = container.resolve<IPanelService>('IPanelService');
const panelController = container.resolve<IPanelController>('IPanelController');

const PanelView = connect(panelService, Panel, panelController as Controller);

export { PanelView };
