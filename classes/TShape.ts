import { Shape } from './Shape';

export class TShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, '#8c2ac6', [
      [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      [
        [0, 2],
        [1, 2],
        [1, 3],
        [2, 2],
      ],
    ]);
  }
}
