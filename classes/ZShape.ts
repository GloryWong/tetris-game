import { Shape, ShapeOptions } from './Shape';

export class ZShape extends Shape {
  constructor(
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    options?: ShapeOptions,
  ) {
    super(
      ctx,
      cubeSize,
      '#bd261a',
      [
        [
          [1, 1],
          [1, 2],
          [2, 2],
          [2, 3],
        ],
        [
          [0, 2],
          [1, 1],
          [1, 2],
          [2, 1],
        ],
      ],
      options,
    );
  }

  static create(...args: ConstructorParameters<typeof ZShape>) {
    return new ZShape(...args);
  }
}
