import { Canvas } from '@antv/g';

export default class GController {
  private _canvas: Canvas;
  private _canvasContainerSelector = '.report-canvas-container';
  private _canvasSelector = '#report-canvas';

  public init() {
    const canvasContainer = document.querySelector(
      this._canvasContainerSelector,
    )!;
    const canvas = document.querySelector(this._canvasSelector)!;
    const { clientWidth: width, clientHeight: height } = canvasContainer;
    const { id: containerId } = canvas;

    this._canvas = new Canvas({
      containerId,
      width,
      height,
    });
  }

  public destroy() {
    this._canvas.destroy();
  }
}
