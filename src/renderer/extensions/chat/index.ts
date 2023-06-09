import molecule from 'mo';
import { type IExtension } from 'mo/model/extension';
import { type IExtensionService } from 'mo/services';
import { DATA_SOURCE_ID, dataSourceActivityBar, dataSourceSidebar, createDataSourceMenuItem } from './base';

export class ChatExtension implements IExtension {

    id: string = DATA_SOURCE_ID;
    name: string = 'Chat';

    activate(extensionCtx: IExtensionService): void {
        this.initUI();
    }

    initUI() {
        molecule.sidebar.add(dataSourceSidebar);
        molecule.activityBar.add(dataSourceActivityBar);

        setTimeout(() => { // TODO: upgrade the Molecule and remove it.
            molecule.menuBar.append(createDataSourceMenuItem, 'File');
        })
    }

    dispose(extensionCtx: IExtensionService): void {
        molecule.sidebar.remove(dataSourceSidebar.id);
        molecule.activityBar.remove(dataSourceActivityBar.id);
    }
}