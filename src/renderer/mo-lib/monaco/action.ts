/* eslint-disable import/prefer-default-export */

import { DisposableStore } from 'monaco-editor/esm/vs/base/common/lifecycle';
import { ContextKeyExpr } from 'monaco-editor/esm/vs/platform/contextkey/common/contextkey';
import { KeybindingsRegistry } from 'monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry';
import { CommandsRegistry } from 'monaco-editor/esm/vs/platform/commands/common/commands';
import {
  MenuRegistry,
  MenuId,
} from 'monaco-editor/esm/vs/platform/actions/common/actions';
import { IDisposable } from '@allai/core/esm/monaco/common';
import { Action2 } from '@allai/core/esm/monaco/action';

export function registerAction2(Ctor: { new (): Action2 }): IDisposable {
  const disposables = new DisposableStore();

  const action = new Ctor();

  const { f1, menu, keybinding, description, ...command } = action.desc;

  // command
  disposables.add(
    CommandsRegistry.registerCommand({
      id: command.id,
      handler: (accessor, ...args) => action.run(accessor, ...args),
      description,
    })
  );

  // menu
  if (Array.isArray(menu)) {
    disposables.add(
      MenuRegistry.appendMenuItems(
        menu.map((item) => ({
          id: item.id,
          item: { command, ...item },
        }))
      )
    );
  } else if (menu) {
    disposables.add(MenuRegistry.appendMenuItem(menu.id, { command, ...menu }));
  }
  if (f1) {
    disposables.add(
      MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
        command,
        when: command.precondition,
      })
    );
    disposables.add(MenuRegistry.addCommand(command));
  }

  // keybinding
  if (Array.isArray(keybinding)) {
    for (const item of keybinding) {
      KeybindingsRegistry.registerKeybindingRule({
        ...item,
        id: command.id,
        when: command.precondition
          ? ContextKeyExpr.and(command.precondition, item.when)
          : item.when,
      });
    }
  } else if (keybinding) {
    KeybindingsRegistry.registerKeybindingRule({
      ...keybinding,
      id: command.id,
      when: command.precondition
        ? ContextKeyExpr.and(command.precondition, keybinding.when)
        : keybinding.when,
    });
  }

  return disposables;
}
