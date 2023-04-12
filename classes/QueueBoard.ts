import { IShape } from './IShape';
import { JShape } from './JShape';
import { LShape } from './LShape';
import { OShape } from './OShape';
import { SShape } from './SShape';
import { Shape } from './Shape';
import { TShape } from './TShape';
import { ZShape } from './ZShape';

function getRandom(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

type QueueBoardShapeCreator = (
  ctx: CanvasRenderingContext2D,
  cubeSize: number,
) => Shape;

export class QueueBoard {
  private readonly canvas;
  readonly cubeSize;
  private readonly ctx;
  readonly shapeCreatorQueue: QueueBoardShapeCreator[] = [];
  private readonly shapeCreators: QueueBoardShapeCreator[] = [
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new IShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new LShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new JShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new ZShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new SShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new TShape(ctx, cubeSize),
    (ctx: CanvasRenderingContext2D, cubeSize: number) =>
      new OShape(ctx, cubeSize),
  ];

  constructor(container?: HTMLElement, cubeSize = 0) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas unsupported');

    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.canvas.width = this.canvas.height = this.cubeSize * 4;
    container?.append(this.canvas);

    this.enqueueShapeCreator();
  }

  private getRandomIndex() {
    return getRandom(0, this.shapeCreators.length);
  }

  private render(shapeCreator: QueueBoardShapeCreator) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    shapeCreator(this.ctx, this.cubeSize).draw();
  }

  private enqueueShapeCreator() {
    const shapeCreator = this.shapeCreators[this.getRandomIndex()];
    this.shapeCreatorQueue.unshift(shapeCreator);
    this.render(shapeCreator);
  }

  dequeueShapeCreator() {
    this.enqueueShapeCreator();
    return this.shapeCreatorQueue.pop();
  }
}
