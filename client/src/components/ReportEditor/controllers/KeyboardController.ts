import bind from '$decorators/bind';

import { ReportEl } from '../widgets/ReportElement';
import {
  ReportElsActionType,
  ReportElsAction,
} from '../widgets/ReportElement/reducer';
import customMetaKey from '$utils/customMetaKEey';

interface ShortCutsControllerProps {
  reportElsState: ReportEl[];
  reportElsDispatch: React.Dispatch<ReportElsAction>;
  onSave(reportELs: ReportEl[]): void;
}

export default class ShortCutsController {
  private _props: ShortCutsControllerProps;
  private _preventDelete = false;

  public constructor(props: ShortCutsControllerProps) {
    this._props = props;
    window.addEventListener('keydown', this._onKeydown);
    window.addEventListener('keyup', this._onKeyup);
  }

  public update(partialProps: Partial<ShortCutsControllerProps>) {
    this._props = {
      ...this._props,
      ...partialProps,
    };
  }

  public destroy() {
    window.removeEventListener('keydown', this._onKeydown);
    window.removeEventListener('keyup', this._onKeyup);
  }

  @bind
  public _onInputText(id: string, text: string) {
    this._props.reportElsDispatch({
      type: ReportElsActionType.InputText,
      payload: { id, text },
    });
  }

  @bind
  private _onKeydown(event: KeyboardEvent) {
    const { reportElsState, reportElsDispatch } = this._props;

    switch (event.keyCode) {
      // delete
      case 8:
        if (this._preventDelete) {
          return;
        }

        this._preventDelete = true;

        event.preventDefault();
        reportElsDispatch({
          type: ReportElsActionType.Delete,
          payload: reportElsState
            .filter(reportEl => reportEl.selected)
            .map(selectedReportEl => selectedReportEl.id),
        });
        break;
      // 左
      case 37:
        event.preventDefault();
        reportElsDispatch({
          type: ReportElsActionType.Move,
          payload: reportElsState
            .filter(reportEl => reportEl.selected)
            .map(reportElSelected => ({
              id: reportElSelected.id,
              x: reportElSelected.x + (event.shiftKey ? -1 : -10),
              y: reportElSelected.y,
            })),
        });
        break;
      // 上
      case 38:
        event.preventDefault();
        reportElsDispatch({
          type: ReportElsActionType.Move,
          payload: reportElsState
            .filter(reportEl => reportEl.selected)
            .map(reportElSelected => ({
              id: reportElSelected.id,
              x: reportElSelected.x,
              y: reportElSelected.y + (event.shiftKey ? -1 : -10),
            })),
        });
        break;
      // 右
      case 39:
        event.preventDefault();
        reportElsDispatch({
          type: ReportElsActionType.Move,
          payload: reportElsState
            .filter(reportEl => reportEl.selected)
            .map(reportElSelected => ({
              id: reportElSelected.id,
              x: reportElSelected.x + (event.shiftKey ? 1 : 10),
              y: reportElSelected.y,
            })),
        });
        break;
      // 下
      case 40:
        event.preventDefault();
        reportElsDispatch({
          type: ReportElsActionType.Move,
          payload: reportElsState
            .filter(reportEl => reportEl.selected)
            .map(reportElSelected => ({
              id: reportElSelected.id,
              x: reportElSelected.x,
              y: reportElSelected.y + (event.shiftKey ? 1 : 10),
            })),
        });
        break;
      // A
      case 65:
        // ctrl(command) + shift + A / ctrl(command) + A: 全选
        if (customMetaKey({ ctrlKey: event.ctrlKey, metaKey: event.metaKey })) {
          event.preventDefault();
          event.shiftKey
            ? reportElsDispatch({
                type: ReportElsActionType.Unselect,
                payload: reportElsState.map(reportEl => reportEl.id),
                disallowUndo: true,
              })
            : reportElsDispatch({
                type: ReportElsActionType.Select,
                payload: reportElsState.map(reportEl => reportEl.id),
                disallowUndo: true,
              });
        }
        break;
      // S
      case 83:
        // ctrl(command) + S: 保存
        if (customMetaKey({ ctrlKey: event.ctrlKey, metaKey: event.metaKey })) {
          event.preventDefault();
          this._props.onSave(reportElsState);
        }
        break;
      // Y
      case 89:
        // ctrl(command) + Y: redo
        if (customMetaKey({ ctrlKey: event.ctrlKey, metaKey: event.metaKey })) {
          event.preventDefault();
          reportElsDispatch({
            type: ReportElsActionType.Redo,
            disallowUndo: true,
          });
        }
        break;
      // Z
      case 90:
        // ctrl(command) + shift + Z / ctrl(command) + Z: redo / undo
        if (customMetaKey({ ctrlKey: event.ctrlKey, metaKey: event.metaKey })) {
          event.preventDefault();
          event.shiftKey
            ? reportElsDispatch({
                type: ReportElsActionType.Redo,
                disallowUndo: true,
              })
            : reportElsDispatch({
                type: ReportElsActionType.Undo,
                disallowUndo: true,
              });
        }
        break;
      default:
        break;
    }
  }

  @bind
  private _onKeyup(event: KeyboardEvent) {
    this._preventDelete = false;
  }
}
