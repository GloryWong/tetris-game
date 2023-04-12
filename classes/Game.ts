import { FieldBoard, FieldBoardOptions } from './FieldBoard';
import { CubeMatrix } from './CubeMatrix';
import { QueueBoard } from './QueueBoard';
import { ScoreSystem } from './ScoreSystem';
import { UserInteraction } from './UserInteraction';
import { DEFAULT_CONFIG } from './constants';

interface GameOptions extends FieldBoardOptions {
  cubeSize?: number;
  queueContainer?: HTMLElement;
  queueCubeSize?: number;
}

export class Game {
  private readonly cubeMatrix;
  private readonly fieldBoard;
  private readonly queueBoard;
  private readonly userInteraction;
  private readonly scoreSystem;

  constructor(FieldBoardContainer: HTMLElement, options: GameOptions = {}) {
    const {
      cubeSize = DEFAULT_CONFIG.CUBE_SIZE,
      rowCount = DEFAULT_CONFIG.ROW_COUNT,
      colCount = DEFAULT_CONFIG.COL_COUNT,
      queueContainer,
      queueCubeSize = cubeSize,
    } = options;

    // Cube Matrix
    this.cubeMatrix = new CubeMatrix(rowCount, colCount);
    this.cubeMatrix.onClearRows((rows) => {
      this.scoreSystem.addLines(rows.length);
    });

    // Field Board
    this.fieldBoard = new FieldBoard(
      FieldBoardContainer,
      this.cubeMatrix,
      options,
    );
    this.fieldBoard.onBeforeStart(() => {
      this.scoreSystem.reset();
      if (!this.fieldBoard.hasCurrentShape()) {
        this.updateFieldBoardCurrentShape();
      }
    });
    this.fieldBoard.onShapeFixed(() => {
      this.updateFieldBoardCurrentShape();
    });

    // Queue Board
    this.queueBoard = new QueueBoard(queueContainer, queueCubeSize);

    // Score system
    this.scoreSystem = new ScoreSystem(options.colCount);

    // Bind interact event listeners
    this.userInteraction = this.setupUserInteraction();
  }

  private updateFieldBoardCurrentShape() {
    const shapeCreator = this.queueBoard.dequeueShapeCreator();
    if (shapeCreator) {
      const shape = shapeCreator(this.fieldBoard.ctx, this.fieldBoard.cubeSize);
      this.fieldBoard.setCurrentShape(shape);
    }
  }

  private setupUserInteraction() {
    return new UserInteraction({
      ArrowUp: () => this.fieldBoard.rotate(),
      ArrowDown: {
        action: () => this.fieldBoard.moveDown(),
        longPressAction: () => this.fieldBoard.moveDown(2),
      },
      ArrowRight: {
        action: () => this.fieldBoard.moveRight(),
        longPressAction: () => this.fieldBoard.moveRight(2),
      },
      ArrowLeft: {
        action: () => this.fieldBoard.moveLeft(),
        longPressAction: () => this.fieldBoard.moveLeft(2),
      },
      ' ': () => this.fieldBoard.toggle(),
    });
  }

  destroy() {
    this.userInteraction.destroy();
  }

  get status() {
    return this.fieldBoard.status;
  }

  onStatusChange(...args: Parameters<FieldBoard['onStatusChange']>) {
    this.fieldBoard.onStatusChange(...args);
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
