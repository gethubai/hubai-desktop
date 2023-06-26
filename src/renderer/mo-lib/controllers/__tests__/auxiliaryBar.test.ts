import { AuxiliaryBarService } from '@/services';
import { container } from 'tsyringe';
import { AuxiliaryController } from '..';

const auxiliaryBarController = container.resolve(AuxiliaryController);
const auxiliaryBarService = container.resolve(AuxiliaryBarService);

describe('The AuxiliaryBar Controller', () => {
  test('Should support call onClick', () => {
    const original = auxiliaryBarService.setActive;
    auxiliaryBarService.setActive = jest.fn((props) => original(props));

    const clickFn = jest.fn();
    auxiliaryBarService.onTabClick(clickFn);

    auxiliaryBarController.onClick(1);
    expect(auxiliaryBarService.setActive).toHaveBeenCalledWith(1);
    expect(clickFn).toHaveBeenCalledWith(1);

    auxiliaryBarController.onClick(1);
    expect(auxiliaryBarService.setActive).toHaveBeenCalledWith(undefined);
    expect(clickFn).toHaveBeenCalledWith(1);

    auxiliaryBarService.setActive = original;
  });
});
