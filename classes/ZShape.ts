import { Shape } from './Shape';

export class ZShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, 'red', [
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
    ]);
  }
}
