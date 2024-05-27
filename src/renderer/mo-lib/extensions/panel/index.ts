import { AppContext, IExtension } from '@hubai/core';
// eslint-disable-next-line import/no-cycle
import molecule from 'mo';

const ExtendsPanel: IExtension = {
  id: 'ExtendsPanel',
  name: 'Extends Panel',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activate(context: AppContext) {
    molecule.panel.onTabClose((key) => {
      const { data = [], current } = molecule.panel.getState();
      if (current?.id === key) {
        const index = data.findIndex((item) => item.id === key);
        const next = index === data.length - 1 ? data.length - 2 : index + 1;
        const nextPanel = data[next];
        if (nextPanel) {
          molecule.panel.open(nextPanel);
        }
      }

      molecule.panel.remove(key);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
};

export default ExtendsPanel;
