/* eslint-disable import/prefer-default-export */
import { AppContext, IExtension } from '@hubai/core';
/* eslint-disable-next-line import/no-cycle */
import molecule from 'mo';
import { CommandQuickSideBarViewAction } from 'mo/monaco/quickToggleSideBarAction';

export const ExtendsActivityBar: IExtension = {
  id: 'ExtendsActivityBar',
  name: 'Extend The Default ActivityBar',
  activate(extensionCtx: AppContext) {
    molecule.activityBar.onChange((pre, cur) => {
      if (cur !== pre) {
        molecule.activityBar.setActive(cur);
        molecule.sidebar.setActive(cur);

        const { sidebar } = molecule.layout.getState();
        if (sidebar.hidden) {
          extensionCtx.services.extension.executeCommand(
            CommandQuickSideBarViewAction.ID,
            cur
          );
        }
      } else {
        extensionCtx.services.extension.executeCommand(
          CommandQuickSideBarViewAction.ID,
          cur
        );
      }
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
};
