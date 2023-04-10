import { Board } from './Board';
import { NextShapeBoard } from './NextShapeBoard';

interface GameOptions {
  cubeSize?: number;
  nextShapeContainer?: HTMLElement;
  nextShapeCubeSize?: number;
}

export class Game {
  readonly board;
  readonly nextShapeBoard;

  constructor(boardContainer: HTMLElement, options: GameOptions = {}) {
    const {
      cubeSize = 30,
      nextShapeContainer,
      nextShapeCubeSize = cubeSize,
    } = options;
    this.board = new Board(boardContainer, cubeSize);
    this.board.onBeforeStart(() => {
      if (!this.board.hasCurrentShape()) {
        this.updateBoardCurrentShape();
      }
    });
    this.board.onShapeFixed(() => {
      this.updateBoardCurrentShape();
    });

    // Next Shape Board
    this.nextShapeBoard = new NextShapeBoard(
      nextShapeContainer,
      nextShapeCubeSize,
    );
  }

  private updateBoardCurrentShape() {
    const shapeCreator = this.nextShapeBoard.dequeueShapeCreator();
    if (shapeCreator) {
      const shape = shapeCreator(this.board.ctx, this.board.cubeSize);
      this.board.setCurrentShape(shape);
    }
  }
}
