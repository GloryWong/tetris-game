import { Anime } from './Anime';
import { Cube } from './Cube';
import { CubeMatrix, CubeMatrixSide } from './CubeMatrix';
import { Shape } from './Shape';

export class FieldBoard extends Anime {
  readonly ctx: CanvasRenderingContext2D;
  readonly width;
  readonly height;
  readonly cubeSize;
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
    rowCount: number,
    colCount: number,
    cubeSize: number,
    cubeMatrix: CubeMatrix,
  ) {
    super();
    this.setAction(this.moveDown);
    const canvas = document.createElement('canvas');
    if (!canvas.getContext('2d')) throw new Error('Canvas unsupported');

    this.cubeSize = cubeSize;
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.width = this.colCount * this.cubeSize;
    this.height = this.rowCount * this.cubeSize;

    container.style.position = 'relative';

    const fieldCanvas = this.createFieldCanvas(
      this.cubeSize,
      this.cubeSize,
      this.width,
      this.height,
    );
    this.ctx = fieldCanvas.getContext('2d')!;

    const bgCanvas = this.createBgCanvas(
      this.rowCount + 2,
      this.colCount + 2,
      this.cubeSize,
    );

    container.append(bgCanvas, fieldCanvas);

    // Cube Matrix
    this.cubeMatrix = cubeMatrix;
    this.cubeMatrix.onBeforeTidy((cubes) =>
      cubes.forEach((cube) => cube.clear()),
    );
    this.cubeMatrix.onAfterTidy((cubes) =>
      cubes.forEach((cube) => cube.draw()),
    );
  }

  private createFieldCanvas(
    top: number,
    left: number,
    width: number,
    height: number,
  ) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = `${top}px`;
    canvas.style.left = `${left}px`;
    return canvas;
  }

  private createBgCanvas(rowCount: number, colCount: number, cubeSize: number) {
    const canvas = document.createElement('canvas');
    canvas.width = colCount * cubeSize;
    canvas.height = rowCount * cubeSize;
    canvas.style.backgroundColor = '#000';
    const ctx = canvas.getContext('2d')!;

    // borders
    const color = '#787878';
    for (let i = 0, len = colCount; i < len; i++) {
      new Cube(ctx, 0, i, cubeSize, color).draw();
    }
    for (let i = 1, len = rowCount - 1; i < len; i++) {
      new Cube(ctx, i, colCount - 1, cubeSize, color).draw();
    }
    for (let i = 0, len = colCount; i < len; i++) {
      new Cube(ctx, rowCount - 1, i, cubeSize, color).draw();
    }
    for (let i = 1, len = rowCount - 1; i < len; i++) {
      new Cube(ctx, i, 0, cubeSize, color).draw();
    }

    ctx.strokeStyle = '#333';
    ctx.beginPath();
    // row lines
    for (
      let i = 2,
        start = cubeSize,
        end = cubeSize + (colCount - 2) * cubeSize,
        len = rowCount - 1;
      i < len;
      i++
    ) {
      const pos = cubeSize * i;
      ctx.moveTo(start, pos);
      ctx.lineTo(end, pos);
    }
    // col lines
    for (
      let i = 2,
        start = cubeSize,
        end = cubeSize + (rowCount - 2) * cubeSize,
        len = colCount - 1;
      i < len;
      i++
    ) {
      const pos = cubeSize * i;
      ctx.moveTo(pos, start);
      ctx.lineTo(pos, end);
    }
    ctx.stroke();

    return canvas;
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
