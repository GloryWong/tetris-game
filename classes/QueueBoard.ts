import { IShape } from './IShape';
import { JShape } from './JShape';
import { LShape } from './LShape';
import { OShape } from './OShape';
import { SShape } from './SShape';
import { Shape, ShapeOptions } from './Shape';
import { TShape } from './TShape';
import { ZShape } from './ZShape';

function getRandom(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

type QueueBoardShapeCreator = (
  ctx: CanvasRenderingContext2D,
  cubeSize: number,
  options?: ShapeOptions,
) => Shape;

export interface QueueBoardOptions {
  queueSize?: number;
}

export class QueueBoard {
  private readonly canvas;
  private readonly cubeSize;
  private readonly ctx;
  private readonly queueSize;
  readonly shapeCreatorQueue;

  private static readonly shapeCreators: QueueBoardShapeCreator[] = [
    IShape.create,
    LShape.create,
    JShape.create,
    ZShape.create,
    SShape.create,
    TShape.create,
    OShape.create,
  ];

  private static getRandomShapeCreator() {
    return QueueBoard.shapeCreators[
      getRandom(0, QueueBoard.shapeCreators.length)
    ];
  }

  constructor(
    container: HTMLElement,
    cubeSize: number,
    options: QueueBoardOptions = {},
  ) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas unsupported');

    this.queueSize = options.queueSize ?? 1;

    this.ctx = ctx;
    this.cubeSize = cubeSize;
    this.canvas.width = this.cubeSize * 4;
    this.canvas.height = this.queueSize * this.cubeSize * 4;
    container.append(this.canvas);

    this.shapeCreatorQueue = this.createShapeCreatorQueue(this.queueSize);
    this.refresh();
  }

  private createShapeCreatorQueue(queueSize: number) {
    return Array(queueSize)
      .fill(undefined)
      .map(() => QueueBoard.getRandomShapeCreator());
  }

  private refresh() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapeCreatorQueue.forEach((shapeCreator, index) => {
      shapeCreator(this.ctx, this.cubeSize, {
        row: index * 4,
        col: 0,
        draw: true,
      });
    });
  }

  private enqueueShapeCreator(shapeCreator: QueueBoardShapeCreator) {
    this.shapeCreatorQueue.push(shapeCreator);
  }

  private dequeueShapeCreator() {
    return this.shapeCreatorQueue.shift();
  }

  dequeueShapeCreatorAndRefresh() {
    const shapeCreator = this.dequeueShapeCreator();
    this.enqueueShapeCreator(QueueBoard.getRandomShapeCreator());
    this.refresh();
    return shapeCreator;
  }
}
