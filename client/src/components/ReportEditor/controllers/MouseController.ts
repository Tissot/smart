import * as React from 'react';

import bind from '$decorators/bind';

import {
  ReportEl,
  ReportElType,
  ReportChartType,
  ReportChartDataSource,
  ReportChartOptions,
} from '../widgets/ReportElement';
import {
  ReportElsActionType,
  ReportElsAction,
} from '../widgets/ReportElement/reducer';

interface MouseControllerProps {
  reportElsState: ReportEl[];
  reportElsDispatch: React.Dispatch<ReportElsAction>;
}

interface CanvasContainer {
  mouseDownPosition: { x: number; y: number };
}

export default class MouseController {
  private _props: MouseControllerProps;
  private _canvasContainer: CanvasContainer = {
    mouseDownPosition: { x: 0, y: 0 },
  };

  public constructor(props: MouseControllerProps) {
    this._props = props;
  }

  public update(partialProps: Partial<MouseControllerProps>) {
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
          height: 160,
          x: 600,
          y: 200,
          text: '',
          selected: true,
          editing: true,
        },
      ],
    });
  }

  /**
   * 点击 chart 列表项添加 chart。
   */
  @bind
  public onChartListItemClick(chartType: ReportChartType) {
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
          chartType,
          width: 400,
          height: 300,
          x: 600,
          y: 200,
          dataSource: {
            id: '',
            data: [],
          },
          selected: true,
          editing: true,
          options: {},
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
  public onReportElMouseDown(reportElId: string, unselectOthers: boolean) {
    const { reportElsState, reportElsDispatch } = this._props;

    if (unselectOthers) {
      reportElsDispatch({
        type: ReportElsActionType.Unselect,
        payload: reportElsState.map(reportEl => reportEl.id),
        disallowUndo: true,
      });
    }

    reportElsDispatch({
      type: ReportElsActionType.StartEdit,
      payload: reportElId,
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

  /** Report Editor */
  /** 设置图表的数据源 */
  @bind
  public onChartDataSourceSelect(
    id: string,
    dataSource: ReportChartDataSource,
  ) {
    this._props.reportElsDispatch({
      type: ReportElsActionType.SetChartDataSource,
      payload: { id, dataSource },
    });
  }

  /** 设置图表的选项 */
  @bind
  public onChartOptionsChange(id: string, options: ReportChartOptions) {
    this._props.reportElsDispatch({
      type: ReportElsActionType.SetChartOptions,
      payload: { id, options },
    });
  }
}
