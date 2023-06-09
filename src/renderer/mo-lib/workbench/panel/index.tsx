import 'reflect-metadata';
import { container } from 'tsyringe';
import { connect } from 'mo/react';
import { IPanelService, PanelService } from 'mo/services';
import { PanelController } from 'mo/controller/panel';
import Panel from './panel';

const panelService = container.resolve<IPanelService>(PanelService);
const panelController = container.resolve(PanelController);

const PanelView = connect(panelService, Panel, panelController);

export { PanelView };
