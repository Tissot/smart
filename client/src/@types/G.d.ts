declare module '@antv/g' {
  export interface CanvasConfig {
    containerDom?: HTMLElement; // 容器DOM
    containerId?: string; // 容器id
    width: number; // 指定画布宽度
    height: number; // 指定画布高度
    pixelRatio?: number; // 指定屏幕分辨率
    renderer?: 'canvas' | 'svg'; // 渲染模式，默认为canvas，可选择svg。
  }

  export type ShapeType =
    | 'circle'
    | 'ellipse'
    | 'fan'
    | 'image'
    | 'marker'
    | 'path'
    | 'polygon'
    | 'rect'
    | 'text';

  export type Point = [number, number];

  export interface CircleAttribute {
    x: number; // 圆心的 x 坐标
    y: number; // 圆心的 y 坐标
    r: number; // 半径
  }

  export interface EllipseAttribute {
    x: number; // 圆点的 x 坐标
    y: number; // 圆点的y坐标
    xr: number; // 水平半径
    yr: number; // 垂直半径
  }

  export interface FanAttribute {
    /** 扇形圆心的 x 坐标 */
    x: number;

    y: number; // 扇形圆心的 y 坐标
    rs: number; // 内圈半径
    re: number; // 外圈半径
    startAngle: number; // 起点弧度
    endAngle: number; // 终点弧度
    clockwise: boolean; // 为true时顺时针渲染，为false时逆时针渲染
  }

  export interface ImageAttribute {
    x: number; // 图片左上角的 x 坐标
    y: number; // 图片左上角的 y 坐标
    width: number; // 图片宽度
    height: number; // 图片高度
    img: URL | ImageData | HTMLImageElement | HTMLCanvasElement; // 图片源。G支持多种格式的图片: url, ImageData, Image, canvas。
  }

  export interface MarkerAttribute {
    x: number; // 中心的 x 坐标
    y: number; // 中心的 y 坐标
    r: number; // 形状半径
    symbol(x: number, y: number, r: number): any; // 指定形状。G内置了一些常用形状，如圆形circle, 矩形 square, 菱形 diamond, 三角形 triangle, 倒三角形triangle - down，也可以是自定义的path路径。
  }

  export interface PathAttribute {
    path: any; //线条。可以是String形式，也可以是线段的数组。
    startArrow: boolean | any; // 起始端的箭头。为true时为默认的箭头效果，也可以是一个自定义箭头。
    endArrow: boolean | any; // 末尾端的箭头。为true时为默认的箭头效果，也可以是一个自定义箭头。
    lineAppendWidth: number; // 为了提升边的击中范围，增加这个属性，扩展响应范围。
  }

  export interface PolyGonAttribute {
    points: Point[]; // 多边形的所有端点坐标。
  }

  export interface RectAttribute {
    x: number; // 矩形左上角的 x 坐标
    y: number; // 矩形左上角的 y 坐标
    width: number; // 矩形的宽度
    height: number; // 矩形的高度
    radius: number[]; // 定义圆角。支持整数或数组形式， 分别对应左上、右上、右下、左下角的半径。
  }

  export interface TextGonAttribute {
    text: number; // 文本内容。可以用\n定义多行文本。
    fontStyle: string; //对应 font - style，默认为normal
    fontVariant: string; // 对应 font - variant，默认值为normal
    fontWeight: string; // 对应 font - weight，默认值为normal
    fontSize: number; // 对应 font - size， 默认值为12
    fontFamily: string; // 对应 font - family，默认值为sans - serif
    textAlign: 'center' | 'end' | 'left' | 'right' | 'start'; // 文本内容的对齐方式, 支持的属性为: center | end | left | right | start，默认值为start。
    textBaseline: 'top' | 'middle' | 'bottom' | 'alphabetic' | 'hanging'; // 绘制时的文本基线, 支持的属性: top | middle | bottom | alphabetic | hanging，默认值为bottom。
  }

  export type ShapeAttribute =
    | CircleAttribute
    | EllipseAttribute
    | FanAttribute
    | ImageAttribute
    | MarkerAttribute
    | PathAttribute
    | PolyGonAttribute
    | RectAttribute
    | TextGonAttribute;

  export interface ShapeConfig {
    attrs: ShapeAttribute;
  }

  export class Canvas {
    public constructor(cfg: CanvasConfig);
    public addShape(type: ShapeType, cfg: ShapeConfig): void;
    public draw(): void;
    public changeSize(width, height): void;
    public destroy(): void;
  }
}
