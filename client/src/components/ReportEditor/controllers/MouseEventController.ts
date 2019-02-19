import * as React from 'react';

import bind from '$decorators/bind';

import {
  ReportEl,
  ReportElType,
  ReportChartType,
} from '../widgets/ReportElement';
import {
  ReportElsActionType,
  ReportElsAction,
} from '../widgets/ReportElement/reducer';

// ToDo: delete
import chartAttr from '../widgets/ReportElement/chartAttr';

interface MouseEventControllerProps {
  reportEls: ReportEl[];
  reportElsDispatch: React.Dispatch<ReportElsAction>;
}

interface CanvasContainer {
  mouseDownPosition: { x: number; y: number };
}

export default class MouseEventController {
  private _props: MouseEventControllerProps;
  private _canvasContainer: CanvasContainer = {
    mouseDownPosition: { x: 0, y: 0 },
  };

  public constructor(props: MouseEventControllerProps) {
    this._props = props;
  }

  public update(partialProps: Partial<MouseEventControllerProps>) {
    this._props = {
      ...this._props,
      ...partialProps,
    };
  }

  public destroy() {}

  /**
   * 点击 chart 列表项添加 chart。
   */
  @bind
  public onAddTextBtnClick() {
    this._props.reportElsDispatch({
      type: ReportElsActionType.Add,
      payload: [
        {
          // TODO: 此处 id 生成方法待更改。
          id: `_${Math.random()
            .toString(36)
            .substr(2, 9)}${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: ReportElType.Text,
          width: 400,
          height: 100,
          x: 0,
          y: 0,
          data: '请在此输入文本。',
          selected: true,
        },
      ],
    });
  }

  /**
   * 点击 chart 列表项添加 chart。
   */
  @bind
  public onChartListItemClick(chartType: ReportChartType) {
    const { data, cols } = chartAttr[chartType];

    this._props.reportElsDispatch({
      type: ReportElsActionType.Add,
      payload: [
        {
          // TODO: 此处 id 生成方法待更改。
          id: `_${Math.random()
            .toString(36)
            .substr(2, 9)}${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: ReportElType.Chart,
          width: 400,
          height: 300,
          x: 0,
          y: 0,
          data,
          cols,
          selected: true,
          chartType,
        },
      ],
    });
  }

  /**
   * 点击 canvas container 未移动 unselect 所有元素，点击 report elements 不触发:
   *  - onCanvasContainerMouseDown
   *  - unselectAllReportEls
   *  - preventUnselectAllReportEls
   */
  // prettier-ignore
  @bind
  public onCanvasContainerMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this._canvasContainer.mouseDownPosition = { x: event.clientX, y: event.clientY };
  }

  // prettier-ignore
  @bind
  public onCanvasContainerMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { x, y } = this._canvasContainer.mouseDownPosition;
    const { clientX, clientY } = event;
    const { reportEls, reportElsDispatch } = this._props;

    x === clientX && y === clientY && reportElsDispatch({
      type: ReportElsActionType.Unselect,
      payload: reportEls.map(reportEl => reportEl.id),
      disallowUndo: true,
    });
  }

  // prettier-ignore
  public onReportElsMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
  }

  /**  鼠标按下选中 report elment。 */
  // prettier-ignore
  @bind
  public onReportElsMouseDown(reportElsId: string[], unselectOthers: boolean) {
    const { reportEls, reportElsDispatch } = this._props;

    if (unselectOthers) {
      reportElsDispatch({
        type: ReportElsActionType.Unselect,
        payload: reportEls.map(reportEl => reportEl.id),
        disallowUndo: true,
      });
    }

    reportElsDispatch({
      type: ReportElsActionType.Select,
      payload: reportElsId,
      disallowUndo: true,
    });
  }

  /**  修复 bizcharts 的 canvas 的 cursor 总是为 default 的 bug：鼠标悬浮在 report elements 上时设置 cursor。 */
  public onReportElsMouseMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    const canvas: HTMLCanvasElement | null = document.querySelector(
      `#${event.currentTarget.id} canvas`,
    );
    const html = document.querySelector('html');
    if (canvas && html) {
      canvas.style.cursor = html.style.cursor || 'auto';
    }
  }
}
