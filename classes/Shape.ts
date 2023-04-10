import { FixedLengthArray } from 'type-fest';
import { Cube } from './Cube';

type ShapeIndex = FixedLengthArray<[row: number, col: number], 4>;

type ShapeIndexes = ShapeIndex[];

export abstract class Shape {
  readonly ctx;
  private row = 0;
  private col = 0;
  readonly cubeSize;
  readonly color;
  readonly cubesSet;
  private currentIndex: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    color: string,
    shapeIndexes: ShapeIndexes,
  ) {
    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.color = color;

    this.cubesSet = this.createCubesSet(shapeIndexes);
    this.currentIndex = 0;
  }

  draw(row?: number, col?: number) {
    const _row = row ?? this.row;
    const _col = col ?? this.col;

    this.moveTo(_row, _col, true);
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

  private createCubesSet(shapeIndexes: ShapeIndexes) {
    return shapeIndexes.map((shapeIndex) =>
      shapeIndex.map(([row, col]) => this.createCube(row, col)),
    );
  }

  private render() {
    this.cubesSet[this.currentIndex].forEach((cube) => cube.render());
  }

  private clear() {
    this.cubesSet[this.currentIndex].forEach((cube) => cube.clear());
  }

  moveTo(row: number, col: number, draw = false) {
    const offsetRow = row - this.row;
    const offsetCol = col - this.col;
    this.move(offsetRow, offsetCol, draw);
  }

  move(row: number, col: number, draw = false) {
    this.row += row;
    this.col += col;

    draw && this.clear();
    this.cubesSet.forEach((cubes) => {
      cubes.forEach((cube) => cube.move(row, col));
    });
    draw && this.render();
  }

  private get nextIndex() {
    const i = this.currentIndex + 1;
    return i % this.cubesSet.length;
  }

  moveDown() {
    this.move(1, 0, true);
  }

  moveRight() {
    this.move(0, 1, true);
  }

  moveLeft() {
    this.move(0, -1, true);
  }

  rotate() {
    this.clear();
    this.currentIndex = this.nextIndex;
    this.render();
  }

  get current() {
    return this.cubesSet[this.currentIndex];
  }

  get next() {
    return this.cubesSet[this.nextIndex];
  }
}
