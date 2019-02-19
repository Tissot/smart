import { ReportEl } from './index';

export enum ReportElsActionType {
  Add = 'add',
  Delete = 'delete',
  Move = 'move',
  Resize = 'resize',
  Select = 'select',
  Unselect = 'unselect',
  Undo = 'undo',
  Redo = 'redo',
}

interface ReportElsCommonAction {
  type: ReportElsActionType;
  payload?: any;
  disallowUndo?: boolean;
}

interface ReportElsAddAction extends ReportElsCommonAction {
  type: ReportElsActionType.Add;
  payload: ReportEl[];
  disallowUndo?: boolean;
}

interface ReportElsDeleteAction extends ReportElsCommonAction {
  type: ReportElsActionType.Delete;
  payload: string[];
  disallowUndo?: boolean;
}

interface ReportElsMoveAction extends ReportElsCommonAction {
  type: ReportElsActionType.Move;
  payload: {
    id: string;
    x: number;
    y: number;
  }[];
  disallowUndo?: boolean;
}

interface ReportElsResizeAction extends ReportElsCommonAction {
  type: ReportElsActionType.Resize;
  payload: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  disallowUndo?: boolean;
}

interface ReportElsSelectAction extends ReportElsCommonAction {
  type: ReportElsActionType.Select;
  payload: string[];
  disallowUndo: true;
}

interface ReportElsUnselectAction extends ReportElsCommonAction {
  type: ReportElsActionType.Unselect;
  payload: string[];
  disallowUndo: true;
}

interface ReportElsUndoAction extends ReportElsCommonAction {
  type: ReportElsActionType.Undo;
  disallowUndo: true;
}

interface ReportElsRedoAction extends ReportElsCommonAction {
  type: ReportElsActionType.Redo;
  disallowUndo: true;
}

export type ReportElsAction =
  | ReportElsAddAction
  | ReportElsDeleteAction
  | ReportElsMoveAction
  | ReportElsResizeAction
  | ReportElsSelectAction
  | ReportElsUnselectAction
  | ReportElsUndoAction
  | ReportElsRedoAction;

let undoStack: ReportElsAction[] = [];
let redoStack: ReportElsAction[] = [];
const undoStackMaxLength = 10000;

export function undoEnabled() {
  return undoStack.length > 0;
}

export function redoEnabled() {
  return redoStack.length > 0;
}

export function clearUndoRedo() {
  undoStack = [];
  redoStack = [];
  console.log(undoStack);
}

export default function reportElsReducer(
  reportEls: ReportEl[],
  action: ReportElsAction,
): ReportEl[] {
  const originalActionType = action.type;

  switch (action.type) {
    case ReportElsActionType.Undo:
      if (undoEnabled()) {
        action = undoStack.pop()!;
      } else {
        return reportEls;
      }
      break;
    case ReportElsActionType.Redo:
      if (redoEnabled()) {
        action = redoStack.pop()!;
      } else {
        return reportEls;
      }
      break;
    default:
      break;
  }

  // 不执行无用的 action 。
  if (action.payload.length === 0) return reportEls;

  let reverseAction: ReportElsAction | null = null;

  switch (action.type) {
    case ReportElsActionType.Add:
      reverseAction = {
        type: ReportElsActionType.Delete,
        payload: action.payload.map(
          reportElWillRemove => reportElWillRemove.id,
        ),
      };

      reportEls = reportEls
        .map(reportEl => ({
          ...reportEl,
          selected: false,
        }))
        .concat(action.payload);
      break;
    case ReportElsActionType.Delete:
      reverseAction = {
        type: ReportElsActionType.Add,
        payload: reportEls.filter(
          reportEl => action.payload.indexOf(reportEl.id) !== -1,
        ),
      };

      reportEls = reportEls.filter(
        reportEl => action.payload.indexOf(reportEl.id) === -1,
      );
      break;
    case ReportElsActionType.Move:
      reverseAction = {
        type: ReportElsActionType.Move,
        payload: reportEls
          .filter(reportEl =>
            (action.payload as ReportElsMoveAction['payload']).some(
              reportElMoved => reportElMoved.id === reportEl.id,
            ),
          )
          .map(reportElWillMove => {
            const { id, x, y } = reportElWillMove;

            return { id, x, y };
          }),
      };

      reportEls = reportEls.map(reportEl => {
        for (const reportElMoved of action.payload as ReportElsMoveAction['payload']) {
          if (reportEl.id === reportElMoved.id) {
            const { x, y } = reportElMoved;
            const { width, height } = reportEl;
            const { clientWidth, clientHeight } = document.querySelector(
              '.report-canvas-container',
            )!;

            return {
              ...reportEl,
              // 2 * 2 中的第一个 2 是 reportEl 的边框宽度。
              x: Math.max(Math.min(x, clientWidth - width - 2 * 2), 0),
              y: Math.max(Math.min(y, clientHeight - height - 2 * 2), 0),
            };
          }
        }

        return reportEl;
      });
      break;
    case ReportElsActionType.Resize:
      reverseAction = {
        type: ReportElsActionType.Resize,
        payload: reportEls
          .filter(reportEl =>
            (action.payload as ReportElsResizeAction['payload']).some(
              reportElResized => reportElResized.id === reportEl.id,
            ),
          )
          .map(reportElWillResize => {
            const { id, x, y, width, height } = reportElWillResize;

            return { id, x, y, width, height };
          }),
      };

      reportEls = reportEls.map(reportEl => {
        for (const reportElResized of action.payload as ReportElsResizeAction['payload']) {
          if (reportEl.id === reportElResized.id) {
            const { x, y, width, height } = reportElResized;
            const { clientWidth, clientHeight } = document.querySelector(
              '.report-canvas-container',
            )!;

            return {
              ...reportEl,
              // 2 * 2 中的第一个 2 是 reportEl 的边框宽度。
              x: Math.max(Math.min(x, clientWidth - width - 2 * 2), 0),
              y: Math.max(Math.min(y, clientHeight - height - 2 * 2), 0),
              width,
              height,
            };
          }
        }

        return reportEl;
      });
      break;
    case ReportElsActionType.Select:
      reportEls = reportEls.map(reportEl =>
        (action.payload as ReportElsSelectAction['payload']).some(
          reportElSelectedId => reportEl.id === reportElSelectedId,
        )
          ? {
              ...reportEl,
              selected: true,
            }
          : reportEl,
      );
      break;
    case ReportElsActionType.Unselect:
      reportEls = reportEls.map(reportEl =>
        (action.payload as ReportElsSelectAction['payload']).some(
          reportElSelectedId => reportEl.id === reportElSelectedId,
        )
          ? {
              ...reportEl,
              selected: false,
            }
          : reportEl,
      );
      break;
    default:
      throw new Error(`Unexcepted action type ${action.type}`);
  }

  if (!reverseAction || action.disallowUndo) {
    return reportEls;
  }

  if (originalActionType === ReportElsActionType.Undo) {
    redoStack.push(reverseAction);
  } else {
    if (originalActionType !== ReportElsActionType.Redo) {
      redoStack = [];

      if (undoStack.length === undoStackMaxLength) {
        undoStack.unshift();
      }
    }

    undoStack.push(reverseAction);
  }

  console.log(undoStack);
  console.log(redoStack);

  return reportEls;
}
