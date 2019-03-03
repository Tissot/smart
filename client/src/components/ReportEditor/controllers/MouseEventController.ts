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
  reportElsState: ReportEl[];
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

  /** Toolbar */
  /**
   * 点击 redo 按钮。
   */
  @bind
  public onRedoBtnClick() {
    this._props.reportElsDispatch({
      type: ReportElsActionType.Redo,
      disallowUndo: true,
    });
  }

  /**
   * 点击 undo 按钮。
   */
  @bind
  public onUndoBtnClick() {
    this._props.reportElsDispatch({
      type: ReportElsActionType.Undo,
      disallowUndo: true,
    });
  }

  /**
   * 点击全选按钮。
   */
  @bind
  public onSelectAllBtnClick() {
    const { reportElsState, reportElsDispatch } = this._props;

    reportElsDispatch({
      type: ReportElsActionType.Select,
      payload: reportElsState.map(reportEl => reportEl.id),
      disallowUndo: true,
    });
  }

  /**
   * 点击取消选择按钮。
   */
  @bind
  public onUnselectAllBtnClick() {
    const { reportElsState, reportElsDispatch } = this._props;

    reportElsDispatch({
      type: ReportElsActionType.Unselect,
      payload: reportElsState.map(reportEl => reportEl.id),
      disallowUndo: true,
    });
  }

  /**
   * 点击删除按钮。
   */
  @bind
  public onDeleteSelectedBtnClick() {
    const { reportElsState, reportElsDispatch } = this._props;

    reportElsDispatch({
      type: ReportElsActionType.Delete,
      payload: reportElsState
        .filter(reportEl => reportEl.selected)
        .map(reportElToDelete => reportElToDelete.id),
    });
  }

  /**
   * 点击添加文本按钮。
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

  /** Report Editor */
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
    const { reportElsState, reportElsDispatch } = this._props;

    x === clientX && y === clientY && reportElsDispatch({
      type: ReportElsActionType.Unselect,
      payload: reportElsState.map(reportEl => reportEl.id),
      disallowUndo: true,
    });
  }

  /** Report Element */
  // prettier-ignore
  public onReportElMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
  }

  /**  鼠标按下选中 report elment。 */
  // prettier-ignore
  @bind
  public onReportElMouseDown(reportElsId: string[], unselectOthers: boolean) {
    const { reportElsState, reportElsDispatch } = this._props;

    if (unselectOthers) {
      reportElsDispatch({
        type: ReportElsActionType.Unselect,
        payload: reportElsState.map(reportEl => reportEl.id),
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
  public onReportElMouseMove(
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
