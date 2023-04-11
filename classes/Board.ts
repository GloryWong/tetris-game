import { Anime } from './Anime';
import { CubeMatrix, CubeMatrixSide } from './CubeMatrix';
import { Shape } from './Shape';

export class Board extends Anime {
  readonly ctx: CanvasRenderingContext2D;
  readonly cubeSize;
  readonly width;
  readonly height;
  readonly rowCount = 20;
  readonly colCount = 10;
  private _currentShape: Shape | null = null;
  private cubeMatrix;

  // callbacks
  private beforeStartCb?: () => void;
  private shapeFixedCb?: () => void;
  private stopCb?: () => void;

  constructor(container: HTMLElement, cubeSize: number) {
    super();
    this.setAction(this.moveDown);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas unsupported');

    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.width = canvas.width = cubeSize * this.colCount;
    this.height = canvas.height = cubeSize * this.rowCount;

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.position = 'relative';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = this.width;
    bgCanvas.height = this.height;
    container.append(bgCanvas, canvas);

    this.initBg(bgCanvas);

    this.cubeMatrix = new CubeMatrix(this.rowCount, this.colCount);
    this.cubeMatrix.onBeforeTidy((cubes) =>
      cubes.forEach((cube) => cube.clear()),
    );
    this.cubeMatrix.onAfterTidy((cubes) =>
      cubes.forEach((cube) => cube.render()),
    );
  }

  private initBg(canvas: HTMLCanvasElement) {
    canvas.style.backgroundColor = '#012';
    const ctx = canvas.getContext('2d')!;

    ctx.strokeStyle = '#123';
    ctx.beginPath();
    // row lines
    for (let i = 0; i < this.rowCount - 1; i++) {
      const pos = this.cubeSize * (i + 1);
      ctx.moveTo(0, pos);
      ctx.lineTo(this.width, pos);
    }
    // col lines
    for (let i = 0; i < this.colCount - 1; i++) {
      const pos = this.cubeSize * (i + 1);
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.height);
    }
    ctx.stroke();
  }

  private canMove(shape: Shape, direction: CubeMatrixSide) {
    return !shape.current.some(
      (cube) =>
        this.cubeMatrix.isTouchBorder(cube, direction) ||
        this.cubeMatrix.hasCubeNeighbour(cube, direction),
    );
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
      console.warn('Board.currentShape is not set yet');
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
