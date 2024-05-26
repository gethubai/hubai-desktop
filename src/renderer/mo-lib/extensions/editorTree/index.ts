import { IExtension } from '@hubai/core';
// eslint-disable-next-line import/no-cycle
import molecule from 'mo';

const ExtendsEditorTree: IExtension = {
  id: 'ExtendsEditorTree',
  name: 'Extends Editor Tree',

  activate() {
    molecule.editorTree.onSelect((tabId, groupId) => {
      molecule.editor.setActive(groupId, tabId);
    });

    molecule.editorTree.onClose((tabId, groupId) => {
      molecule.editor.closeTab(tabId, groupId);
    });

    molecule.editorTree.onCloseOthers((tabItem, groupId) => {
      molecule.editor.closeOther(tabItem, groupId);
    });

    molecule.editorTree.onCloseAll((groupId) => {
      if (groupId) {
        molecule.editor.closeAll(groupId);
      } else {
        const { groups } = molecule.editor.getState();
        groups?.forEach((group) => {
          molecule.editor.closeAll(group.id!);
        });
      }
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
};
export default ExtendsEditorTree;
