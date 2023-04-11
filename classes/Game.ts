import { Board } from './Board';
import { NextShapeBoard } from './NextShapeBoard';
import { UserInteraction } from './UserInteraction';

interface GameOptions {
  cubeSize?: number;
  nextShapeContainer?: HTMLElement;
  nextShapeCubeSize?: number;
}

export class Game {
  readonly board;
  readonly nextShapeBoard;
  readonly userInteraction;

  constructor(boardContainer: HTMLElement, options: GameOptions = {}) {
    const {
      cubeSize = 30,
      nextShapeContainer,
      nextShapeCubeSize = cubeSize,
    } = options;

    // Board
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

    // Bind interact event listeners
    this.userInteraction = this.setupUserInteraction();
  }

  private updateBoardCurrentShape() {
    const shapeCreator = this.nextShapeBoard.dequeueShapeCreator();
    if (shapeCreator) {
      const shape = shapeCreator(this.board.ctx, this.board.cubeSize);
      this.board.setCurrentShape(shape);
    }
  }

  private setupUserInteraction() {
    return new UserInteraction({
      ArrowUp: () => this.board.rotate(),
      ArrowDown: {
        action: () => this.board.moveDown(),
        longPressAction: () => this.board.moveDown(2),
      },
      ArrowRight: {
        action: () => this.board.moveRight(),
        longPressAction: () => this.board.moveRight(2),
      },
      ArrowLeft: {
        action: () => this.board.moveLeft(),
        longPressAction: () => this.board.moveLeft(2),
      },
      Enter: () => this.board.toggle(),
    });
  }

  destroy() {
    this.userInteraction.destroy();
  }
}
