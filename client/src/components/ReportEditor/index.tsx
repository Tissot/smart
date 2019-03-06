import * as React from 'react';
import { Layout } from 'antd';

import customMetaKey from '$utils/customMetaKEey';

import {
  GController,
  InteractController,
  KeyboardController,
  MouseController,
} from './controllers';

import ReportElement, { ReportEl, ReportElType } from './widgets/ReportElement';
import reportElsReducer, {
  ReportElsActionType,
} from './widgets/ReportElement/reducer';
import Toolbar from './widgets/Toolbar';
import ConfigPanel from './widgets/ConfigPanel';

import './index.less';

const { Content } = Layout;

interface ReportEditorProps {
  initialEls: ReportEl[];
  dataSources: {
    rows: {
      id: string;
      name: string;
      data: any[];
    }[];
    count: number;
  };
  onSave(reportELs: ReportEl[]): void;
}

function ReportEditor(props: ReportEditorProps) {
  const { initialEls, dataSources, onSave } = props;
  const reportCanvasRef = React.useRef<HTMLDivElement>(null);
  const [reportEls, reportElsDispatch] = React.useReducer(
    reportElsReducer,
    {
      undoStack: [],
      redoStack: [],
      state: [],
    },
    {
      type: ReportElsActionType.Add,
      payload: initialEls,
      disallowUndo: true,
    },
  );
  const controller = React.useMemo(
    () => ({
      g: new GController(),
      interact: new InteractController({ reportElsDispatch }),
      keyboard: new KeyboardController({
        reportElsState: reportEls.state,
        reportElsDispatch,
        onSave,
      }),
      mouse: new MouseController({
        reportElsState: reportEls.state,
        reportElsDispatch,
      }),
    }),
    [],
  );
  const editingReportEl = React.useMemo(() => {
    for (const reportEl of reportEls.state) {
      if (reportEl.editing) {
        return reportEl;
      }
    }

    return null;
  }, [reportEls.state]);

  React.useEffect(() => {
    controller.keyboard.update({ reportElsState: reportEls.state });
    controller.mouse.update({ reportElsState: reportEls.state });
  }, [reportEls.state]);

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
        disableDelete={
          reportEls.state.filter(reportEl => reportEl.selected).length === 0
        }
        onUndoBtnClick={controller.mouse.onUndoBtnClick}
        onRedoBtnClick={controller.mouse.onRedoBtnClick}
        onSelectAllBtnClick={controller.mouse.onSelectAllBtnClick}
        onChartListItemClick={controller.mouse.onChartListItemClick}
        onAddTextBtnClick={controller.mouse.onAddTextBtnClick}
        onDeleteSelectedBtnClick={controller.mouse.onDeleteSelectedBtnClick}
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
              onMouseMove={
                reportEl.type === ReportElType.Chart
                  ? controller.mouse.onReportElMouseMove
                  : undefined
              }
              // onMouseDown 用 useCallBack 按删除会报错。
              onMouseDown={(
                event: React.MouseEvent<HTMLDivElement, MouseEvent>,
              ) =>
                controller.mouse.onReportElMouseDown(
                  reportEl.id,
                  !customMetaKey({
                    ctrlKey: event.ctrlKey,
                    metaKey: event.metaKey,
                  }),
                )
              }
              onMouseUp={controller.mouse.onReportElMouseUp}
              // onInputText 用 useCallBack 按删除会报错。
              onInputText={
                reportEl.type === ReportElType.Text
                  ? (event: any) =>
                      controller.keyboard._onInputText(
                        reportEl.id,
                        event.target.value,
                      )
                  : undefined
              }
            />
          ))}
        </Content>
        <ConfigPanel
          editingReportEl={editingReportEl}
          dataSources={dataSources}
          onChartDataSourceSelect={controller.mouse.onChartDataSourceSelect}
          onChartOptionsChange={controller.mouse.onChartOptionsChange}
        />
      </Layout>
    </Layout>
  );
}

export default React.memo(ReportEditor);
