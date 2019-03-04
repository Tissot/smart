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
  KeyboardController,
  MouseController,
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
      keyboard: new KeyboardController({
        reportElsState: reportEls.state,
        reportElsDispatch,
      }),
      mouse: new MouseController({
        reportElsState: reportEls.state,
        reportElsDispatch,
      }),
    }),
    [],
  );

  React.useEffect(() => {
    controller.keyboard.update({ reportElsState: reportEls.state });
    controller.mouse.update({ reportElsState: reportEls.state });
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
      controller.keyboard.destroy();
      controller.mouse.destroy();
    };
  }, []);

  return (
    <Layout className="report-editor">
      <Toolbar
        disableUndo={reportEls.undoStack.length === 0}
        disableRedo={reportEls.redoStack.length === 0}
        mouseController={controller.mouse}
      />
      <Layout>
        <Content
          className="report-canvas-container"
          onMouseDown={controller.mouse.onCanvasContainerMouseDown}
          onMouseUp={controller.mouse.onCanvasContainerMouseUp}
        >
          <div ref={reportCanvasRef} id="report-canvas" />
          {reportEls.state.map(reportEl => (
            <ReportElement
              key={reportEl.id}
              {...reportEl}
              mouseController={controller.mouse}
              keyboardController={controller.keyboard}
            />
          ))}
        </Content>
        <ConfigPanel />
      </Layout>
    </Layout>
  );
});
