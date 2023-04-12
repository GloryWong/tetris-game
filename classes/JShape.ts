import { Shape } from './Shape';

export class JShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, '#001ec5', [
      [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 3],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      [
        [0, 2],
        [0, 3],
        [1, 2],
        [2, 2],
      ],
    ]);
  }
}
