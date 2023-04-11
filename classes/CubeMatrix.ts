import { Cube } from './Cube';

export type CubeMatrixSide = 'top' | 'bottom' | 'left' | 'right';

export type BeforeTidyCb = (cubes: Cube[]) => void;
export type AfterTidyCb = BeforeTidyCb;

export class CubeMatrix {
  private matrix; // row * col;
  private rowCount;
  private colCount;

  private beforeTidyCb?: BeforeTidyCb;
  private afterTidyCb?: AfterTidyCb;

  constructor(rowCount: number, colCount: number) {
    this.matrix = this.createInitialCubes(rowCount, colCount);
    this.rowCount = rowCount;
    this.colCount = colCount;
  }

  private createInitialCubes(rowCount: number, colCount: number) {
    return Array.from(Array(rowCount), () =>
      Array<Cube | undefined>(colCount).fill(undefined),
    );
  }

  private isRowFull(row: number) {
    return !this.matrix[row].includes(undefined);
  }

  private filterFullRows(rows: number[]) {
    return rows.filter((row) => this.isRowFull(row));
  }

  private addCube(cube: Cube) {
    if (this.isOccupied(cube) || this.expectOverBorder(cube, 'top'))
      return false;
    this.matrix[cube.row][cube.col] = cube;
    return true;
  }

  addCubes(cubes: Cube[]) {
    const successAddedCubes: Cube[] = [];
    cubes.forEach((cube) => {
      if (this.addCube(cube)) {
        successAddedCubes.push(cube);
      }
    });

    const fullRows = this.filterFullRows(
      successAddedCubes.map((cube) => cube.row),
    );
    this.clearRowsAndTidy(fullRows);

    return successAddedCubes;
  }

  get cubes() {
    return this.matrix.flat().filter((v) => v !== undefined) as Cube[];
  }

  getCube(row: number, col: number) {
    if (row < 0 || col < 0) return undefined;
    return this.matrix[row][col];
  }

  hasCube(row: number, col: number) {
    return this.getCube(row, col) !== undefined;
  }

  hasNeighbour(cube: Cube, side: CubeMatrixSide) {
    switch (side) {
      case 'top':
        return this.hasCube(cube.row - 1, cube.col);
      case 'bottom':
        return this.hasCube(cube.row + 1, cube.col);
      case 'left':
        return this.hasCube(cube.row, cube.col - 1);
      case 'right':
        return this.hasCube(cube.row, cube.col + 1);
    }
  }

  isTouchBorder(cube: Cube, border: CubeMatrixSide) {
    switch (border) {
      case 'top':
        return cube.row === 0;
      case 'bottom':
        return cube.row === this.rowCount - 1;
      case 'left':
        return cube.col === 0;
      case 'right':
        return cube.col === this.colCount - 1;
    }
  }

  isOccupied(cube: Cube) {
    return this.hasCube(cube.row, cube.col);
  }

  isOverlap(cubes: Cube[]) {
    return cubes.some((cube) => this.isOccupied(cube));
  }

  expectOverBorder(cube: Cube, border: CubeMatrixSide) {
    switch (border) {
      case 'top':
        return cube.row < 0;
      case 'bottom':
        return cube.row > this.rowCount - 1;
      case 'left':
        return cube.col < 0;
      case 'right':
        return cube.col > this.colCount - 1;
    }
  }

  expectOverBorders(cube: Cube, borders: CubeMatrixSide[]) {
    return borders.some((border) => this.expectOverBorder(cube, border));
  }

  clear() {
    this.matrix = this.createInitialCubes(this.rowCount, this.colCount);
  }

  private clearRowsAndTidy(clearedRows: number[]) {
    if (clearedRows.length === 0) return;

    this.beforeTidyCb?.(this.cubes);

    const matrix = this.matrix;

    let lastClearedRow = -1;
    for (let row = matrix.length - 1; row >= 0; row--) {
      if (clearedRows.includes(row)) {
        if (lastClearedRow === -1) {
          lastClearedRow = row;
        }
      } else if (lastClearedRow !== -1) {
        matrix[row].forEach((cube, col) => {
          cube?.move(lastClearedRow - cube.row, 0);
          matrix[lastClearedRow][col] = cube;
        });
        lastClearedRow--;
      }
    }

    this.afterTidyCb?.(this.cubes);
  }

  onBeforeTidy(cb: BeforeTidyCb) {
    this.beforeTidyCb = cb;
  }

  onAfterTidy(cb: AfterTidyCb) {
    this.afterTidyCb = cb;
  }
}
