import 'reflect-metadata';
import { container } from 'tsyringe';
import { ExtensionService } from 'mo/services/extensionService';
import { BuiltinService } from 'mo/services/builtinService';
import { CommandQuickAccessViewAction } from 'mo/monaco/quickAccessViewAction';
import { ExtensionController } from '../extension';

const extensionController = container.resolve(ExtensionController);
const extensionService = container.resolve(ExtensionService);
const builtinService = container.resolve(BuiltinService);

describe('The extension controller', () => {
  test('Should inject default value into service', () => {
    const { registerAction } = extensionService;
    const mockFn = jest.fn();
    extensionService.registerAction = mockFn;

    extensionController.initView();

    expect(mockFn).toHaveBeenCalled();
    extensionService.registerAction = registerAction;
  });

  test('Should support to inactive builtinService', () => {
    const { registerAction } = extensionService;
    const mockFn = jest.fn();
    extensionService.registerAction = mockFn;

    extensionController.initView();

    expect(mockFn.mock.calls).toHaveLength(11);
    expect(mockFn.mock.calls[0][0]).toBe(CommandQuickAccessViewAction);

    mockFn.mockClear();
    builtinService.inactiveModule('quickAcessViewAction');

    extensionController.initView();
    expect(mockFn.mock.calls).toHaveLength(10);
    expect(mockFn.mock.calls[0][0]).not.toBe(CommandQuickAccessViewAction);
    extensionService.registerAction = registerAction;
  });
});
