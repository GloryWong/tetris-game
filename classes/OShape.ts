import { Shape } from './Shape';

export class OShape extends Shape {
  constructor(ctx: CanvasRenderingContext2D, cubeSize: number) {
    super(ctx, cubeSize, '#cecb42', [
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
    ]);
  }
}
