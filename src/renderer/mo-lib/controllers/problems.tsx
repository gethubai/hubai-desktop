import React from 'react';
import {
  Float,
  IStatusBarItem,
  ProblemsEvent,
  IProblemsTreeNode,
  type IPanelService,
  type IStatusBarService,
  type ILayoutService,
  type IBuiltinService,
  type IProblemsService,
  Controller,
} from '@allai/core';
import { inject, injectable } from 'tsyringe';
import { type IMonacoService } from '@allai/core/esm/monaco/monacoService';
import { connect } from '@allai/core/esm/react';
import { QuickTogglePanelAction } from 'mo/monaco/quickTogglePanelAction';
import { ProblemsPaneView, ProblemsStatusBarView } from 'mo/workbench/problems';

export interface IProblemsController extends Partial<Controller> {
  onClick?: (e: React.MouseEvent, item: IStatusBarItem) => void;
  onSelect?: (node: IProblemsTreeNode) => void;
}

@injectable()
export class ProblemsController
  extends Controller
  implements IProblemsController
{
  constructor(
    @inject('ILayoutService') private layoutService: ILayoutService,
    @inject('IPanelService') private panelService: IPanelService,
    @inject('IStatusBarService') private statusBarService: IStatusBarService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IProblemsService') private problemsService: IProblemsService,
    @inject('IMonacoService') private monacoService: IMonacoService
  ) {
    super();
  }

  private showHideProblems() {
    const { panel } = this.layoutService.getState();
    const { current } = this.panelService.getState();
    const { builtInPanelProblems } = this.builtinService.getModules();
    if (builtInPanelProblems) {
      if (panel.hidden || current?.id === builtInPanelProblems.id) {
        this.monacoService.commandService.executeCommand(
          QuickTogglePanelAction.ID
        );
      }

      this.panelService.open(builtInPanelProblems);
    }
  }

  public onClick = (e: React.MouseEvent, item: IStatusBarItem) => {
    this.showHideProblems();
  };

  public initView() {
    const { builtInStatusProblems: statusProblems, builtInPanelProblems } =
      this.builtinService.getModules();

    if (statusProblems) {
      statusProblems.render = (item) => <ProblemsStatusBarView {...item} />;
      statusProblems.onClick = this.onClick;

      this.statusBarService.add(statusProblems, Float.left);
    }

    if (builtInPanelProblems) {
      // keep ProblemsPaneView updated to problems' state
      const ProblemsView = connect(this.problemsService, ProblemsPaneView);
      const problemsPanel = builtInPanelProblems;
      problemsPanel.renderPane = () => (
        <ProblemsView onSelect={this.onSelect} />
      );

      this.panelService.add(problemsPanel);
      this.panelService.setActive(problemsPanel.id);
    }

    const { PROBLEM_MODEL_ID, PROBLEM_MODEL_NAME } =
      this.builtinService.getConstants();

    this.problemsService.setState({
      id: PROBLEM_MODEL_ID,
      name: PROBLEM_MODEL_NAME,
    });
  }

  public onSelect = (node: IProblemsTreeNode) => {
    this.emit(ProblemsEvent.onSelect, node);
  };
}
