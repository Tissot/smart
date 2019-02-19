import * as React from 'react';

import { LocaleContext } from '$contexts/LocaleContext';

import ReportElement, { ReportChartType } from './widgets/ReportElement';
import reportElsReducer, {
  ReportElsActionType,
  clearUndoRedo,
} from './widgets/ReportElement/reducer';

import {
  GController,
  InteractController,
  ShortcutsController,
  MouseEventController,
} from './controllers';

import './index.less';

export default React.memo(function ReportEditor() {
  console.log('$ReportEditor re-render');

  const { locale } = React.useContext(LocaleContext);
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

  const reportChartTypes = [
    {
      key: ReportChartType.LineChart,
      value: locale.user.report.lineChart,
    },
    {
      key: ReportChartType.BarChart,
      value: locale.user.report.barChart,
    },
  ];

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
    <div className="report-editor">
      <div className="item-panel">
        <div
          style={{
            height: '50px',
            cursor: 'pointer',
            border: '1px solid #000',
          }}
          onClick={controller.mouseEvent.onAddTextBtnClick}
        >
          text
        </div>
        {reportChartTypes.map(reportChartType => (
          <div
            key={reportChartType.key}
            style={{
              height: '50px',
              cursor: 'pointer',
              border: '1px solid #000',
            }}
            onClick={React.useCallback(
              () =>
                controller.mouseEvent.onChartListItemClick(reportChartType.key),
              [reportChartType.key],
            )}
          >
            {reportChartType.value}
          </div>
        ))}
        <div
          style={{
            height: '50px',
            cursor: 'pointer',
            border: '1px solid #000',
          }}
          onClick={React.useCallback(
            () =>
              reportElsDispatch({
                type: ReportElsActionType.Undo,
                disallowUndo: true,
              }),
            [],
          )}
        >
          undo
        </div>
        <div
          style={{
            height: '50px',
            cursor: 'pointer',
            border: '1px solid #000',
          }}
          onClick={React.useCallback(
            () =>
              reportElsDispatch({
                type: ReportElsActionType.Redo,
                disallowUndo: true,
              }),
            [],
          )}
        >
          redo
        </div>
      </div>
      <div
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
      </div>
    </div>
  );
});
