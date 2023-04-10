import { Shape } from './Shape';

export class SShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, 'green', [
      [
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [1, 2],
        [2, 2],
      ],
    ]);
  }
}
