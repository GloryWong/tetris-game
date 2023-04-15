import { FixedLengthArray } from 'type-fest';
import { Cube } from './Cube';

type ShapeIndex = FixedLengthArray<[row: number, col: number], 4>;

type ShapeIndexes = ShapeIndex[];

export interface ShapeOptions {
  row?: number;
  col?: number;
  draw?: boolean;
}

export abstract class Shape {
  private readonly ctx;
  private row = 0;
  private col = 0;
  readonly cubeSize;
  readonly color;
  readonly shapeSet;
  private currentIndex = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    color: string,
    shapeIndexes: ShapeIndexes,
    options: ShapeOptions = {},
  ) {
    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.color = color;
    this.row = options.row ?? 0;
    this.col = options.col ?? 0;

    this.shapeSet = this.createShapeSet(shapeIndexes);

    if (options.draw) {
      this._draw();
    }
  }

  private createCube(row: number, col: number) {
    return new Cube(
      this.ctx,
      this.row + row,
      this.col + col,
      this.cubeSize,
      this.color,
    );
  }

  private createShapeSet(shapeIndexes: ShapeIndexes) {
    return shapeIndexes.map((shapeIndex) =>
      shapeIndex.map(([row, col]) => this.createCube(row, col)),
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
