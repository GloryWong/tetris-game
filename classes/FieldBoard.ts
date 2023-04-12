import { Anime } from './Anime';
import { Cube } from './Cube';
import { CubeMatrix, CubeMatrixSide } from './CubeMatrix';
import { Shape } from './Shape';
import { DEFAULT_CONFIG } from './constants';

export interface FieldBoardOptions {
  cubeSize?: number;
  rowCount?: number;
  colCount?: number;
}

export class FieldBoard extends Anime {
  readonly ctx: CanvasRenderingContext2D;
  readonly cubeSize;
  readonly width;
  readonly height;
  readonly rowCount;
  readonly colCount;
  private _currentShape: Shape | null = null;
  private cubeMatrix;

  // callbacks
  private beforeStartCb?: () => void;
  private shapeFixedCb?: () => void;
  private stopCb?: () => void;

  constructor(
    container: HTMLElement,
    cubeMatrix: CubeMatrix,
    options: FieldBoardOptions = {},
  ) {
    super();
    this.setAction(this.moveDown);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas unsupported');

    this.ctx = ctx;
    this.cubeSize = options.cubeSize ?? DEFAULT_CONFIG.CUBE_SIZE;
    this.rowCount = options.rowCount ?? DEFAULT_CONFIG.ROW_COUNT;
    this.colCount = options.colCount ?? DEFAULT_CONFIG.COL_COUNT;
    this.width = canvas.width = this.cubeSize * this.colCount;
    this.height = canvas.height = this.cubeSize * this.rowCount;

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.position = 'relative';
    canvas.style.position = 'absolute';
    canvas.style.top = `${this.cubeSize}px`;
    canvas.style.left = `${this.cubeSize}px`;

    const bgCanvas = document.createElement('canvas');
    this.initBg(bgCanvas);
    container.append(bgCanvas, canvas);

    this.cubeMatrix = cubeMatrix;
    this.cubeMatrix.onBeforeTidy((cubes) =>
      cubes.forEach((cube) => cube.clear()),
    );
    this.cubeMatrix.onAfterTidy((cubes) =>
      cubes.forEach((cube) => cube.render()),
    );
  }

  private initBg(canvas: HTMLCanvasElement) {
    canvas.width = this.width + this.cubeSize * 2;
    canvas.height = this.height + this.cubeSize * 2;
    canvas.style.backgroundColor = '#000';
    const ctx = canvas.getContext('2d')!;

    // borders
    const color = '#787878';
    for (let i = 0, len = this.colCount + 2; i < len; i++) {
      new Cube(ctx, 0, i, this.cubeSize, color).render();
    }
    for (let i = 1, len = this.rowCount + 1; i < len; i++) {
      new Cube(ctx, i, this.colCount + 1, this.cubeSize, color).render();
    }
    for (let i = 0, len = this.colCount + 2; i < len; i++) {
      new Cube(ctx, this.rowCount + 1, i, this.cubeSize, color).render();
    }
    for (let i = 1, len = this.rowCount + 1; i < len; i++) {
      new Cube(ctx, i, 0, this.cubeSize, color).render();
    }

    ctx.strokeStyle = '#333';
    ctx.beginPath();
    // row lines
    for (let i = 1; i < this.rowCount; i++) {
      const pos = this.cubeSize * (i + 1);
      ctx.moveTo(this.cubeSize, pos);
      ctx.lineTo(this.width + this.cubeSize, pos);
    }
    // col lines
    for (let i = 1; i < this.colCount; i++) {
      const pos = this.cubeSize * (i + 1);
      ctx.moveTo(pos, this.cubeSize);
      ctx.lineTo(pos, this.height + this.cubeSize);
    }
    ctx.stroke();
  }

  private canRotate(shape: Shape) {
    return !shape.next.some(
      (cube) =>
        this.cubeMatrix.isCubeOverBorders(cube, ['bottom', 'left', 'right']) ||
        this.cubeMatrix.isCubeOccupied(cube),
    );
  }

  private calcAvailableStep(
    shape: Shape,
    expectStep: number,
    direction: CubeMatrixSide,
  ) {
    return this.cubeMatrix.calcCubesRectifiedOffset(
      shape.current,
      expectStep,
      direction,
    );
  }

  moveDown(step = 1) {
    if (this.status !== 'running') return;
    if (!this._currentShape) return;

    const _step = this.calcAvailableStep(this._currentShape, step, 'bottom');
    if (_step > 0) {
      this._currentShape.moveDown(_step);
    } else {
      this.cubeMatrix.addCubes(this._currentShape.current);
      this.shapeFixedCb?.();
    }
  }

  moveRight(step = 1) {
    if (this.status !== 'running') return;
    if (!this._currentShape) return;

    const _step = this.calcAvailableStep(this._currentShape, step, 'right');
    if (_step > 0) this._currentShape.moveRight(_step);
  }

  moveLeft(step = 1) {
    if (this.status !== 'running') return;
    if (!this._currentShape) return;

    const _step = this.calcAvailableStep(this._currentShape, step, 'left');
    if (_step > 0) this._currentShape.moveLeft(_step);
  }

  rotate() {
    if (this.status !== 'running') return;

    if (this._currentShape && this.canRotate(this._currentShape))
      this._currentShape.rotate();
  }

  private clear() {
    this._currentShape = null;
    this.cubeMatrix.clear();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  start() {
    this.clear();
    if (this.beforeStartCb) {
      this.beforeStartCb();
    }
    if (this._currentShape === undefined) {
      console.warn('FieldBoard.currentShape is not set yet');
    }
    super.start();
  }

  stop() {
    super.stop();
    this.stopCb?.();
  }

  hasCurrentShape() {
    return this._currentShape !== null;
  }

  setCurrentShape(shape: Shape) {
    const initialCol = Math.floor(this.colCount / 2) - 2;

    shape.moveTo(-1, initialCol);
    if (this.cubeMatrix.isCubesOverlap(shape.current)) {
      shape.moveTo(-2, initialCol);
    }
    if (this.cubeMatrix.isCubesOverlap(shape.current)) {
      this.stop();
      return;
    }
    shape.draw();
    this._currentShape = shape;
  }

  onBeforeStart(cb: () => void) {
    this.beforeStartCb = cb;
  }

  onShapeFixed(cb: () => void) {
    this.shapeFixedCb = cb;
  }

  onStop(cb: () => void) {
    this.stopCb = cb;
  }
}
