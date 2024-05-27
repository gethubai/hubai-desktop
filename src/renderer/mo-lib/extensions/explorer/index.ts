import { IExtension } from '@hubai/core';
// eslint-disable-next-line import/no-cycle
import molecule from 'mo';

const removePanel = (panel: any) => {
  molecule.explorer.removePanel(panel.id);
};

const ExtendsExplorer: IExtension = {
  id: 'ExtendsExplorer',
  name: 'Extends Explorer',
  activate() {
    molecule.explorer.onRemovePanel(removePanel);
  },

  dispose() {
    // TODO There should remove the onRemovePanel event
    // molecule.explorer.dispose(removePanel);
  },
};
export default ExtendsExplorer;
