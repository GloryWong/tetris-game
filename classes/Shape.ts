import { Cube } from './Cube';
import shapesConfig from './shapes-config.json';

export type ShapeType = keyof typeof shapesConfig;

type ShapeIndex = number[][];
type ShapeIndexes = ShapeIndex[];

export interface ShapeOptions {
  row?: number;
  col?: number;
  draw?: boolean;
}

function getRandom(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

function getShapeConfig(type: ShapeType) {
  return shapesConfig[type];
}

function getRandomShapeTypes() {
  const shapeTypes = Object.keys(shapesConfig) as ShapeType[];
  return shapeTypes[getRandom(0, shapeTypes.length)];
}

export class Shape {
  readonly type;
  private readonly ctx;
  private row = 0;
  private col = 0;
  readonly cubeSize;
  readonly shapeSet;
  private currentIndex = 0;

  constructor(
    type: ShapeType,
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    options: ShapeOptions = {},
  ) {
    this.type = type;
    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.row = options.row ?? 0;
    this.col = options.col ?? 0;

    const { color, indexes } = getShapeConfig(type);
    this.shapeSet = this.createShapeSet(indexes, color);

    if (options.draw) {
      this._draw();
    }
  }

  static createShape(...args: ConstructorParameters<typeof Shape>) {
    return new Shape(...args);
  }

  static getRandomCreator() {
    const type = getRandomShapeTypes();
    return (
      ctx: CanvasRenderingContext2D,
      cubeSize: number,
      options: ShapeOptions = {},
    ) => new Shape(type, ctx, cubeSize, options);
  }

  private createShapeCube(row: number, col: number, color: string) {
    return new Cube(
      this.ctx,
      this.row + row,
      this.col + col,
      this.cubeSize,
      color,
    );
  }

  private createShapeSet(shapeIndexes: ShapeIndexes, color: string) {
    return shapeIndexes.map((shapeIndex) =>
      shapeIndex.map(([row, col]) => this.createShapeCube(row, col, color)),
    );
  }

  clear() {
    this.current.forEach((cube) => cube.clear());
  }

  private _draw() {
    this.current.forEach((cube) => cube.draw());
  }

  draw(row?: number, col?: number) {
    const _row = row ?? this.row;
    const _col = col ?? this.col;
    this.moveTo(_row, _col, true);
  }

  moveTo(row: number, col: number, draw = false) {
    const rowOffset = row - this.row;
    const colOffset = col - this.col;
    this.move(rowOffset, colOffset, draw);
  }

  move(row: number, col: number, draw = false) {
    this.row += row;
    this.col += col;
    draw && this.clear();
    this.shapeSet.forEach((shape) =>
      shape.forEach((cube) => cube.move(row, col)),
    );
    draw && this._draw();
  }

  private get nextIndex() {
    const i = this.currentIndex + 1;
    return i % this.shapeSet.length;
  }

  moveDown(step = 1) {
    this.move(step, 0, true);
  }

  moveRight(step = 1) {
    this.move(0, step, true);
  }

  moveLeft(step = 1) {
    this.move(0, -1 * step, true);
  }

  rotate() {
    this.clear();
    this.currentIndex = this.nextIndex;
    this._draw();
  }

  get current() {
    return this.shapeSet[this.currentIndex];
  }

  get next() {
    return this.shapeSet[this.nextIndex];
  }
}
