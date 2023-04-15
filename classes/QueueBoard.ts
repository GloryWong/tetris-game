import { Shape } from './Shape';

export interface QueueBoardOptions {
  queueSize?: number;
}

export class QueueBoard {
  private readonly canvas;
  private readonly cubeSize;
  private readonly ctx;
  private readonly queueSize;
  readonly shapeCreatorQueue;

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
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.append('NEXT', this.canvas);

    this.shapeCreatorQueue = this.createShapeCreatorQueue(this.queueSize);
    this.refresh();
  }

  private createShapeCreatorQueue(queueSize: number) {
    return Array(queueSize)
      .fill(undefined)
      .map(() => Shape.getRandomCreator());
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

  private enqueueShapeCreator(
    shapeCreator: ReturnType<typeof Shape.getRandomCreator>,
  ) {
    this.shapeCreatorQueue.push(shapeCreator);
  }

  private dequeueShapeCreator() {
    return this.shapeCreatorQueue.shift();
  }

  dequeueShapeCreatorAndRefresh() {
    const shapeCreator = this.dequeueShapeCreator();
    this.enqueueShapeCreator(Shape.getRandomCreator());
    this.refresh();
    return shapeCreator;
  }
}
