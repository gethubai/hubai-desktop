import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { Controller } from '@hubai/core/esm/react/controller';
import { type ILayoutService } from '@hubai/core';
import { LayoutEvents } from '@hubai/core/esm/model/workbench/layout';

export interface ILayoutController extends Partial<Controller> {
  onWorkbenchDidMount?: () => void;
  onPaneSizeChange?: (splitPanePos: number[]) => void;
  onHorizontalPaneSizeChange?: (horizontalSplitPanePos: number[]) => void;
}

@injectable()
export class LayoutController extends Controller implements ILayoutController {
  constructor(@inject('ILayoutService') private layoutService: ILayoutService) {
    super();
  }

  public initView() {}

  public onPaneSizeChange = (splitPanePos: number[]) => {
    this.layoutService.setPaneSize(splitPanePos);
  };

  public onHorizontalPaneSizeChange = (horizontalSplitPanePos: number[]) => {
    this.layoutService.setHorizontalPaneSize(horizontalSplitPanePos);
  };

  public onWorkbenchDidMount = () => {
    this.layoutService.emit(LayoutEvents.OnWorkbenchDidMount);
  };
}
