import * as React from 'react';

import { Layout } from 'antd';

import ReportElement from './widgets/ReportElement';
import reportElsReducer, {
  ReportElsActionType,
  clearUndoRedo,
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
  console.log('$ReportEditor re-render');

  const reportCanvasRef = React.useRef<HTMLDivElement>(null);
  // prettier-ignore
  const [reportEls, reportElsDispatch] = React.useReducer(reportElsReducer, []);
  const controller = React.useMemo(
    () => ({
      g: new GController(),
      interact: new InteractController({ reportEls, reportElsDispatch }),
      shortcuts: new ShortcutsController({ reportEls, reportElsDispatch }),
      mouseEvent: new MouseEventController({ reportEls, reportElsDispatch }),
    }),
    [],
  );

  React.useEffect(() => {
    controller.interact.update({ reportEls });
    controller.shortcuts.update({ reportEls });
    controller.mouseEvent.update({ reportEls });
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
      clearUndoRedo();
    };
  }, []);

  return (
    <Layout className="report-editor">
      <Toolbar mouseEventController={controller.mouseEvent} />
      <Layout>
        <Content
          className="report-canvas-container"
          onMouseDown={controller.mouseEvent.onCanvasContainerMouseDown}
          onMouseUp={controller.mouseEvent.onCanvasContainerMouseUp}
        >
          <div ref={reportCanvasRef} id="report-canvas" />
          {reportEls.map(reportEl => (
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
