import { Shape, ShapeOptions } from './Shape';

export class OShape extends Shape {
  constructor(
    ctx: CanvasRenderingContext2D,
    cubeSize: number,
    options?: ShapeOptions,
  ) {
    super(
      ctx,
      cubeSize,
      '#cecb42',
      [
        [
          [1, 1],
          [1, 2],
          [2, 1],
          [2, 2],
        ],
      ],
      options,
    );
  }

  static create(...args: ConstructorParameters<typeof OShape>) {
    return new OShape(...args);
  }
}
