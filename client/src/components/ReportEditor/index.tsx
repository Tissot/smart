import * as React from 'react';
import { Layout } from 'antd';

import ReportElement from './widgets/ReportElement';
import reportElsReducer, {
  ReportElsActionType,
} from './widgets/ReportElement/reducer';
import Toolbar from './widgets/Toolbar';
import ConfigPanel from './widgets/ConfigPanel';

import {
  GController,
  InteractController,
  ShortcutsController,
  MouseEventController,
} from './controllers';

import './index.less';

const { Content } = Layout;

export default React.memo(function ReportEditor() {
  const reportCanvasRef = React.useRef<HTMLDivElement>(null);
  // prettier-ignore
  const [reportEls, reportElsDispatch] = React.useReducer(reportElsReducer, {
    undoStack: [],
    redoStack: [],
    state: [],
  });
  const controller = React.useMemo(
    () => ({
      g: new GController(),
      interact: new InteractController({ reportElsDispatch }),
      shortcuts: new ShortcutsController({
        reportElsState: reportEls.state,
        reportElsDispatch,
      }),
      mouseEvent: new MouseEventController({
        reportElsState: reportEls.state,
        reportElsDispatch,
      }),
    }),
    [],
  );

  React.useEffect(() => {
    controller.shortcuts.update({ reportElsState: reportEls.state });
    controller.mouseEvent.update({ reportElsState: reportEls.state });
  }, [reportEls]);

  React.useEffect(() => {
    reportElsDispatch({
      type: ReportElsActionType.Add,
      payload: [],
      disallowUndo: true,
    });
    controller.g.init();

    return () => {
      controller.g.destroy();
      controller.interact.destroy();
      controller.shortcuts.destroy();
      controller.mouseEvent.destroy();
    };
  }, []);

  return (
    <Layout className="report-editor">
      <Toolbar
        disableUndo={reportEls.undoStack.length === 0}
        disableRedo={reportEls.redoStack.length === 0}
        mouseEventController={controller.mouseEvent}
      />
      <Layout>
        <Content
          className="report-canvas-container"
          onMouseDown={controller.mouseEvent.onCanvasContainerMouseDown}
          onMouseUp={controller.mouseEvent.onCanvasContainerMouseUp}
        >
          <div ref={reportCanvasRef} id="report-canvas" />
          {reportEls.state.map(reportEl => (
            <ReportElement
              key={reportEl.id}
              {...reportEl}
              mouseEventController={controller.mouseEvent}
            />
          ))}
        </Content>
        <ConfigPanel />
      </Layout>
    </Layout>
  );
});
