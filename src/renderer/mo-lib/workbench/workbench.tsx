import React, { useEffect, useCallback, useMemo } from 'react';
import { container } from 'tsyringe';

import {
  classNames,
  getFontInMac,
  prefixClaName,
  getBEMModifier,
  getBEMElement,
} from '@hubai/core/esm/common/className';
import { APP_PREFIX } from '@hubai/core/esm/common/const';
import { ID_APP } from '@hubai/core/esm/common/id';
import { type ILayoutService, type IWorkbench } from '@hubai/core';
import { ILayout, MenuBarMode } from '@hubai/core/esm/model/workbench/layout';
import { Display, Pane, SplitPane } from '@hubai/core/esm/components';
import { Controller, connect } from '@hubai/core/esm/react';
import { type ILayoutController } from 'mo/controllers';
import SidebarView from './sidebar/sidebarView';
import ActivityBarView from './activityBar/activityBarView';
import { MenuBarView } from './menuBar/menuBarView';
import { EditorView } from './editor/editorView';
// import { PanelView } from './panel/panelView';
import { AuxiliaryBar, AuxiliaryBarTab } from './auxiliaryBar';
import StatusBarView from './statusBar/statusBarView';

const mainBenchClassName = prefixClaName('mainBench');
const workbenchClassName = prefixClaName('workbench');
const compositeBarClassName = prefixClaName('compositeBar');
const appClassName = classNames(APP_PREFIX, getFontInMac());
const workbenchWithHorizontalMenuBarClassName = getBEMModifier(
  workbenchClassName,
  'with-horizontal-menuBar'
);
const withHiddenStatusBar = getBEMModifier(
  workbenchClassName,
  'with-hidden-statusBar'
);
const displayActivityBarClassName = getBEMElement(
  workbenchClassName,
  'display-activityBar'
);

const layoutController =
  container.resolve<ILayoutController>('ILayoutController');
const layoutService: ILayoutService = container.resolve('ILayoutService');

export function WorkbenchView(props: IWorkbench & ILayout & ILayoutController) {
  const {
    activityBar,
    auxiliaryBar,
    menuBar,
    sidebar,
    statusBar,
    onPaneSizeChange,
    onWorkbenchDidMount,
    splitPanePos,
  } = props;

  const getContentSize = useMemo(() => {
    if (!sidebar.hidden && !auxiliaryBar.hidden) return splitPanePos;

    if (sidebar.hidden) {
      return auxiliaryBar.hidden
        ? [0, '100%', 0]
        : [0, 'auto', splitPanePos[2]];
    }

    return [splitPanePos[0], 'auto', 0];
  }, [auxiliaryBar.hidden, sidebar.hidden, splitPanePos]);

  const getContentSashes = useMemo(() => {
    if (!sidebar.hidden && !auxiliaryBar.hidden) return true;

    if (sidebar.hidden) {
      return auxiliaryBar.hidden ? false : [false, true];
    }

    return [true, false];
  }, [sidebar.hidden, auxiliaryBar.hidden]);

  const handleContentChanged = useCallback(
    (sizes: number[]) => {
      const nextPos: number[] = [];
      nextPos[0] = sidebar.hidden ? Number(splitPanePos[0]) : sizes[0];
      nextPos[2] = auxiliaryBar.hidden ? Number(splitPanePos[2]) : sizes[2];

      nextPos[1] =
        sizes.reduce((acc, cur) => acc + cur, 0) - nextPos[0] - nextPos[2];

      onPaneSizeChange?.(nextPos);
    },
    [sidebar.hidden, auxiliaryBar.hidden, splitPanePos, onPaneSizeChange]
  );

  const isMenuBarVertical =
    !menuBar.hidden && menuBar.mode === MenuBarMode.vertical;
  const isMenuBarHorizontal =
    !menuBar.hidden && menuBar.mode === MenuBarMode.horizontal;
  const horizontalMenuBar = isMenuBarHorizontal
    ? workbenchWithHorizontalMenuBarClassName
    : null;
  const hideStatusBar = statusBar.hidden ? withHiddenStatusBar : null;
  const workbenchFinalClassName = classNames(
    workbenchClassName,
    horizontalMenuBar,
    hideStatusBar
  );

  useEffect(() => {
    // call onWorkbenchDidMount after the first render
    onWorkbenchDidMount?.();
  }, []);

  return (
    <div id={ID_APP} className={appClassName} tabIndex={0}>
      <div className={workbenchFinalClassName}>
        <Display visible={isMenuBarHorizontal}>
          <MenuBarView mode={MenuBarMode.horizontal} />
        </Display>
        <div className={mainBenchClassName}>
          <div className={compositeBarClassName}>
            <Display visible={isMenuBarVertical}>
              <MenuBarView mode={MenuBarMode.vertical} />
            </Display>
            <Display
              visible={!activityBar.hidden}
              className={displayActivityBarClassName}
            >
              <ActivityBarView />
            </Display>
          </div>
          <SplitPane
            sizes={getContentSize}
            split="vertical"
            showSashes={getContentSashes}
            onChange={handleContentChanged}
          >
            <Pane minSize={170} maxSize="40%">
              <SidebarView />
            </Pane>
            <Pane minSize="60%" maxSize="100%">
              <EditorView />
            </Pane>
            {/* Uncomment to enable the Problems and output panels again <SplitPane
              sizes={getSizes()}
              showSashes={!panel.hidden && !panel.panelMaximized}
              allowResize={[true, false]}
              split="horizontal"
              onChange={onHorizontalPaneSizeChange!}
            >
              <Pane minSize="10%" maxSize="80%">
                <EditorView />
              </Pane>
              <PanelView />
  </SplitPane> */}
            <Pane minSize={100} maxSize="80%">
              <AuxiliaryBar />
            </Pane>
          </SplitPane>
          <AuxiliaryBarTab />
        </div>
      </div>
      <Display visible={false}>
        <StatusBarView />
      </Display>
    </div>
  );
}

export const Workbench = connect(
  layoutService,
  WorkbenchView,
  layoutController as Controller
);
