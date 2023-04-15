import { Shape, ShapeOptions } from './Shape';

export class LShape extends Shape {
  constructor(
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    options?: ShapeOptions,
  ) {
    super(
      ctx,
      cubeSize,
      '#c16b27',
      [
        [
          [1, 1],
          [1, 2],
          [1, 3],
          [2, 1],
        ],
        [
          [0, 1],
          [0, 2],
          [1, 2],
          [2, 2],
        ],
        [
          [0, 3],
          [1, 1],
          [1, 2],
          [1, 3],
        ],
        [
          [0, 2],
          [1, 2],
          [2, 2],
          [2, 3],
        ],
      ],
      options,
    );
  }

  static create(...args: ConstructorParameters<typeof LShape>) {
    return new LShape(...args);
  }
}
