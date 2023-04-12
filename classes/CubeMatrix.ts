import { Cube } from './Cube';

export type CubeMatrixSide = 'top' | 'bottom' | 'left' | 'right';
export interface CubeMatrixCubePosition {
  row: number;
  col: number;
}

export type BeforeTidyCb = (cubes: Cube[]) => void;
export type AfterTidyCb = BeforeTidyCb;
export type ClearRowsCb = (rows: number[]) => void;

export class CubeMatrix {
  private readonly matrix; // row * col;
  private readonly rowCount;
  private readonly colCount;

  private beforeTidyCb?: BeforeTidyCb;
  private afterTidyCb?: AfterTidyCb;
  private clearRowsCb?: ClearRowsCb;

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

  private calcCubesRows(cubes: Cube[]) {
    return cubes.reduce<number[]>((result, { row }) => {
      if (!result.includes(row)) result.push(row);
      return result;
    }, []);
  }

  private isRowFull(row: number) {
    return !this.matrix[row].includes(undefined);
  }

  private filterFullRows(rows: number[]) {
    return rows.filter((row) => this.isRowFull(row));
  }

  private addCube(cube: Cube) {
    if (this.isCubeOccupied(cube) || this.isCubeOverBorder(cube, 'top'))
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

    const fullRows = this.filterFullRows(this.calcCubesRows(successAddedCubes));
    if (fullRows.length > 0) {
      this.clearRowsAndTidy(fullRows);
      this.clearRowsCb?.(fullRows);
    }

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

  hasCubeNeighbour(cube: Cube, side: CubeMatrixSide) {
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

  isOccupied(row: number, col: number) {
    return this.hasCube(row, col);
  }

  isOverlap(positions: CubeMatrixCubePosition[]) {
    return positions.some(({ row, col }) => this.isOccupied(row, col));
  }

  isCubeOccupied({ row, col }: Cube) {
    return this.isOccupied(row, col);
  }

  isCubesOverlap(cubes: Cube[]) {
    return cubes.some((cube) => this.isCubeOccupied(cube));
  }

  isOverBorder(row: number, col: number, border: CubeMatrixSide) {
    switch (border) {
      case 'top':
        return row < 0;
      case 'bottom':
        return row > this.rowCount - 1;
      case 'left':
        return col < 0;
      case 'right':
        return col > this.colCount - 1;
    }
  }

  isCubeOverBorder({ row, col }: Cube, border: CubeMatrixSide) {
    return this.isOverBorder(row, col, border);
  }

  isCubeOverBorders(cube: Cube, borders: CubeMatrixSide[]) {
    return borders.some((border) => this.isCubeOverBorder(cube, border));
  }

  private calcCubeAvailableTopOffset(cube: Cube) {
    const { row, col } = cube;
    if (col < 0 || col > this.colCount - 1) return row;
    if (row <= 0) return 0;

    for (let i = row - 1; i >= 0; i--) {
      const _cube = this.matrix[i][col];
      if (_cube) {
        return row - _cube.row - 1;
      }
    }

    return row;
  }

  private calcCubeAvailableBottomOffset(cube: Cube) {
    const { row, col } = cube;
    if (col < 0 || col > this.colCount - 1) return row;
    if (row >= this.rowCount - 1) return 0;

    for (let i = row + 1; i < this.rowCount; i++) {
      const _cube = this.matrix[i][col];
      if (_cube) {
        return _cube.row - row - 1;
      }
    }

    return this.rowCount - row - 1;
  }

  private calcCubeAvailableLeftOffset(cube: Cube) {
    const { row, col } = cube;
    if (row < 0 || row > this.rowCount - 1) return col;
    if (col <= 0) return 0;

    for (let i = col - 1; i >= 0; i--) {
      const _cube = this.matrix[row][i];
      if (_cube) {
        return col - _cube.col - 1;
      }
    }

    return col;
  }

  private calcCubeAvailableRightOffset(cube: Cube) {
    const { row, col } = cube;
    if (row < 0 || row > this.rowCount - 1) return col;
    if (col >= this.colCount - 1) return 0;

    for (let i = col + 1; i < this.colCount; i++) {
      const _cube = this.matrix[row][i];
      if (_cube) {
        return _cube.col - col - 1;
      }
    }

    return this.colCount - col - 1;
  }

  private calcCubeAvailableOffset(cube: Cube, direction: CubeMatrixSide) {
    switch (direction) {
      case 'top':
        return this.calcCubeAvailableTopOffset(cube);
      case 'bottom':
        return this.calcCubeAvailableBottomOffset(cube);
      case 'left':
        return this.calcCubeAvailableLeftOffset(cube);
      case 'right':
        return this.calcCubeAvailableRightOffset(cube);
    }
  }

  calcCubeRectifiedOffset(
    cube: Cube,
    expectOffsetValue: number, // must be positive
    direction: CubeMatrixSide,
  ) {
    const avaiableOffset = this.calcCubeAvailableOffset(cube, direction);
    return Math.min(expectOffsetValue, avaiableOffset);
  }

  calcCubesRectifiedOffset(
    cubes: Cube[],
    expectOffsetValue: number, // must be positive
    direction: CubeMatrixSide,
  ) {
    return Math.min(
      expectOffsetValue,
      ...cubes.map((cube) => this.calcCubeAvailableOffset(cube, direction)),
    );
  }

  clear() {
    this.matrix.splice(
      0,
      this.matrix.length,
      ...this.createInitialCubes(this.rowCount, this.colCount),
    );
  }

  private clearRowsAndTidy(clearedRows: number[]) {
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

  onClearRows(cb: ClearRowsCb) {
    this.clearRowsCb = cb;
  }
}
