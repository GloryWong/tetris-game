import { Shape } from './Shape';

export class IShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, '#5bcacc', [
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
      ],
    ]);
  }
}
