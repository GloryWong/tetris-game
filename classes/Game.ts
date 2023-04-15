import { FieldBoard } from './FieldBoard';
import { CubeMatrix } from './CubeMatrix';
import { QueueBoard, QueueBoardOptions } from './QueueBoard';
import { ScoreBoard } from './ScoreBoard';
import { UserInteraction } from './UserInteraction';

type GameOptions = {
  cubeSize?: number;
  rowCount?: number;
  colCount?: number;
} & QueueBoardOptions;

export class Game {
  private readonly cubeMatrix;
  private readonly fieldBoard;
  private readonly queueBoard;
  private readonly userInteraction;
  private readonly scoreBoard;

  constructor(element: HTMLElement, options: GameOptions = {}) {
    const { cubeSize = 30, rowCount = 20, colCount = 10 } = options;

    // UI
    const { fieldBoardContainer, queueBoardContainer, scoreBoardContainer } =
      this.setupUI(element);

    // Cube Matrix
    this.cubeMatrix = new CubeMatrix(rowCount, colCount);
    this.cubeMatrix.onClearRows((rows) => {
      this.scoreBoard.addLines(rows.length);
    });

    // Field Board
    this.fieldBoard = new FieldBoard(
      fieldBoardContainer,
      rowCount,
      colCount,
      cubeSize,
      this.cubeMatrix,
    );
    this.fieldBoard.onBeforeStart(() => {
      this.scoreBoard.reset();
      if (!this.fieldBoard.hasCurrentShape()) {
        this.updateFieldBoardCurrentShape();
      }
    });
    this.fieldBoard.onShapeFixed(() => {
      this.updateFieldBoardCurrentShape();
    });

    // Queue Board
    this.queueBoard = new QueueBoard(queueBoardContainer, cubeSize, options);

    // Score system
    this.scoreBoard = new ScoreBoard(scoreBoardContainer);

    // Bind interact event listeners
    this.userInteraction = this.setupUserInteraction();
  }

  private setupUI(element: HTMLElement) {
    element.style.display = 'flex';
    const fieldBoardContainer = document.createElement('div');
    const queueBoardContainer = document.createElement('div');
    const scoreBoardContainer = document.createElement('div');
    const rightPanel = document.createElement('div');
    rightPanel.style.display = 'flex';
    rightPanel.style.flexDirection = 'column';
    rightPanel.append(queueBoardContainer, scoreBoardContainer);
    fieldBoardContainer.style.paddingRight = '30px';
    element.append(fieldBoardContainer, rightPanel);

    return {
      fieldBoardContainer,
      queueBoardContainer,
      scoreBoardContainer,
    };
  }

  private updateFieldBoardCurrentShape() {
    const shapeCreator = this.queueBoard.dequeueShapeCreatorAndRefresh();
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
    return this.scoreBoard.score;
  }

  onScoreChange(...args: Parameters<ScoreBoard['onScoreChange']>) {
    return this.scoreBoard.onScoreChange(...args);
  }

  get lines() {
    return this.scoreBoard.lines;
  }

  onLinesChange(...args: Parameters<ScoreBoard['onLinesChange']>) {
    return this.scoreBoard.onLinesChange(...args);
  }
}
