import interact from 'interactjs';

import bind from '$decorators/bind';

import {
  ReportElsAction,
  ReportElsActionType,
} from '../widgets/ReportElement/reducer';

interface InteractControllerProps {
  reportElsDispatch: React.Dispatch<ReportElsAction>;
}

interface ResizableOptions extends interact.ResizableOptions {
  restrictEdges: any;
  restrictSize: any;
}

export default class InteractController {
  private _props: InteractControllerProps;
  private _selector = '.report-editor .report-element';

  public constructor(props: InteractControllerProps) {
    this._props = props;

    const draggableOptions: interact.DraggableOptions = {
      onmove: this._onDragMove,
      restrict: {
        restriction: 'parent',
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
      },
    };
    const resizableOptions: ResizableOptions = {
      onmove: this._onResizeMove,
      edges: { left: true, right: true, bottom: true, top: true },
      restrictEdges: {
        outer: 'parent',
      },
      restrictSize: {
        min: { width: 150, height: 150 },
      },
    };

    interact(this._selector)
      .draggable(draggableOptions)
      .resizable(resizableOptions);
  }

  public destroy() {
    (interact(this._selector) as any).unset();
  }

  @bind
  private _onDragMove(event: interact.InteractEvent) {
    const { target, dx, dy } = event;

    const x = Number(target.getAttribute('data-x')) + dx;
    const y = Number(target.getAttribute('data-y')) + dy;

    if (Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }

    this._props.reportElsDispatch({
      type: ReportElsActionType.Move,
      payload: [
        {
          id: target.id,
          x,
          y,
        },
      ],
    });
  }

  @bind
  private _onResizeMove(event: interact.InteractEvent) {
    const { target, deltaRect, rect } = event as any;

    const x = Number(target.dataset.x) + deltaRect.left;
    const y = Number(target.dataset.y) + deltaRect.top;

    if (Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }

    this._props.reportElsDispatch({
      type: ReportElsActionType.Resize,
      payload: [
        {
          id: target.id,
          x,
          y,
          width: rect.width,
          height: rect.height,
        },
      ],
    });
  }
}
