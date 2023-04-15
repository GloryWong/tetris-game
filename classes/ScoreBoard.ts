export type ScoreChangeCb = (score: number, oldScore: number) => void;
export type LinesChangeCb = (lines: number, oldLines: number) => void;

export class ScoreBoard {
  private readonly scoreTable; // lines to score
  private _score = 0;
  private _lines = 0;
  private readonly scoreValueEle;
  private readonly linesValueEle;

  private scoreChangeCb?: ScoreChangeCb;
  private linesChangeCb?: LinesChangeCb;

  constructor(container: HTMLElement) {
    this.scoreTable = this.generateScoreTable();

    const { displayEle: scoreDisplayEle, valueEle: scoreValueEle } =
      this.createDisplay('SCORE', 0);
    const { displayEle: linesDisplayEle, valueEle: linesValueEle } =
      this.createDisplay('LINES', 0);
    this.scoreValueEle = scoreValueEle;
    this.linesValueEle = linesValueEle;

    container.style.margin = '20px 0';
    container.append(linesDisplayEle, scoreDisplayEle);
  }

  private generateScoreTable(): ReadonlyMap<number, number> {
    const scoreTable = new Map<number, number>();
    let preScore = 0;
    for (let i = 1; i <= 4; i++) {
      const score = preScore + i * 10;
      scoreTable.set(i, preScore + i * 10);
      preScore = score;
    }
    return scoreTable;
  }

  private createDisplay(title: string, initialValue: number) {
    const displayEle = document.createElement('div');
    const titleEle = document.createElement('div');
    titleEle.innerText = title;
    const valueEle = document.createElement('div');
    valueEle.innerText = initialValue.toString();
    displayEle.style.display = 'flex';
    displayEle.style.justifyContent = 'space-between';
    displayEle.style.width = '100%';
    displayEle.style.margin = '10px 0';
    displayEle.append(titleEle, valueEle);
    return {
      displayEle,
      valueEle,
    };
  }

  private setScore(value: number) {
    const oldScore = this._score;
    this._score = value;
    this.scoreValueEle.innerText = value.toString();
    this.scoreChangeCb?.(value, oldScore);
    return this;
  }

  private incScore(value: number) {
    this.setScore(this._score + value);
    return this;
  }

  private setLines(value: number) {
    const oldLines = this._lines;
    this._lines = value;
    this.linesValueEle.innerText = value.toString();
    this.linesChangeCb?.(value, oldLines);
    return this;
  }

  private incLines(value: number) {
    this.setLines(this._lines + value);
    return this;
  }

  private awardScoreOnLines(lines: number) {
    this.incScore(this.scoreTable.get(lines) ?? 0);
    return this;
  }

  addLines(lines: number) {
    this.awardScoreOnLines(lines);
    this.incLines(lines);
    return this;
  }

  reset() {
    this.setScore(0);
    this.setLines(0);
  }

  get score() {
    return this._score;
  }

  onScoreChange(cb: ScoreChangeCb) {
    this.scoreChangeCb = cb;
  }

  get lines() {
    return this._lines;
  }

  onLinesChange(cb: LinesChangeCb) {
    this.linesChangeCb = cb;
  }
}
