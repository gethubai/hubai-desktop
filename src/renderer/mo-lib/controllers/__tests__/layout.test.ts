import 'reflect-metadata';
import { container } from 'tsyringe';
import { LayoutService } from '@/services';
import { LayoutController } from '../layout';

const layoutController = container.resolve(LayoutController);
const layoutService = container.resolve(LayoutService);

describe('The layout controller', () => {
  test('Should support to listen to the Workbench did mount event', () => {
    const mockFn = jest.fn();
    layoutService.onWorkbenchDidMount(mockFn);
    layoutController.onWorkbenchDidMount();

    expect(mockFn).toHaveBeenCalled();
  });

  test('Should support to execute onPaneSizeChange', () => {
    const original = layoutService.setPaneSize;
    const mockFn = jest.fn();
    layoutService.setPaneSize = mockFn;
    const splitPanePos = [20, 20];
    layoutController.onPaneSizeChange(splitPanePos);

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn.mock.calls[0][0]).toBe(splitPanePos);
    layoutService.setPaneSize = original;
  });

  test('Should support to execute onHorizontalPaneSizeChange', () => {
    const original = layoutService.setHorizontalPaneSize;
    const mockFn = jest.fn();
    layoutService.setHorizontalPaneSize = mockFn;
    const splitPanePos = [20, 20];
    layoutController.onHorizontalPaneSizeChange(splitPanePos);

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn.mock.calls[0][0]).toBe(splitPanePos);
    layoutService.setHorizontalPaneSize = original;
  });
});
