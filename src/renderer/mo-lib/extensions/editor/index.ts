import { IExtension } from '@hubai/core';
import molecule from 'mo';

const ExtendsEditor: IExtension = {
  id: 'ExtendsEditor',
  name: 'Extends Editor',
  dispose() {},
  activate() {
    molecule.editor.onCloseTab((tabId, groupId) => {
      if (tabId !== undefined && groupId !== undefined) {
        molecule.editor.closeTab(tabId, groupId);
      }
    });

    molecule.editor.onCloseAll((groupId) => {
      if (groupId !== undefined) {
        molecule.editor.closeAll(groupId);
      }
    });

    molecule.editor.onCloseOther((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeOther(tabItem, groupId);
      }
    });

    molecule.editor.onCloseToLeft((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeToLeft(tabItem, groupId);
      }
    });

    molecule.editor.onCloseToRight((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeToRight(tabItem, groupId);
      }
    });
  },
};

export default ExtendsEditor;
