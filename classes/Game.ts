import { Board, BoardOptions } from './Board';
import { CubeMatrix } from './CubeMatrix';
import { NextShapeBoard } from './NextShapeBoard';
import { ScoreSystem } from './ScoreSystem';
import { UserInteraction } from './UserInteraction';
import { DEFAULT_CONFIG } from './constants';

interface GameOptions extends BoardOptions {
  cubeSize?: number;
  nextShapeContainer?: HTMLElement;
  nextShapeCubeSize?: number;
}

export class Game {
  private readonly cubeMatrix;
  private readonly board;
  private readonly nextShapeBoard;
  private readonly userInteraction;
  private readonly scoreSystem;

  constructor(boardContainer: HTMLElement, options: GameOptions = {}) {
    const {
      cubeSize = DEFAULT_CONFIG.CUBE_SIZE,
      rowCount = DEFAULT_CONFIG.ROW_COUNT,
      colCount = DEFAULT_CONFIG.COL_COUNT,
      nextShapeContainer,
      nextShapeCubeSize = cubeSize,
    } = options;

    // Cube Matrix
    this.cubeMatrix = new CubeMatrix(rowCount, colCount);
    this.cubeMatrix.onClearRows((rows) => {
      this.scoreSystem.addLines(rows.length);
    });

    // Board
    this.board = new Board(boardContainer, this.cubeMatrix, options);
    this.board.onBeforeStart(() => {
      this.scoreSystem.reset();
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

    // Score system
    this.scoreSystem = new ScoreSystem(options.colCount);

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
      ' ': () => this.board.toggle(),
    });
  }

  destroy() {
    this.userInteraction.destroy();
  }

  get status() {
    return this.board.status;
  }

  onStatusChange(...args: Parameters<Board['onStatusChange']>) {
    this.board.onStatusChange(...args);
  }

  get score() {
    return this.scoreSystem.score;
  }

  onScoreChange(...args: Parameters<ScoreSystem['onScoreChange']>) {
    return this.scoreSystem.onScoreChange(...args);
  }

  get lines() {
    return this.scoreSystem.lines;
  }

  onLinesChange(...args: Parameters<ScoreSystem['onLinesChange']>) {
    return this.scoreSystem.onLinesChange(...args);
  }
}
