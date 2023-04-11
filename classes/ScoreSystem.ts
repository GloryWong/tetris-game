import { DEFAULT_CONFIG } from './constants';

export type ScoreChangeCb = (score: number, oldScore: number) => void;
export type LinesChangeCb = (lines: number, oldLines: number) => void;

export class ScoreSystem {
  private readonly maxLines;
  private readonly scoreTable; // lines to score
  private _score = 0;
  private _lines = 0;

  private scoreChangeCb?: ScoreChangeCb;
  private linesChangeCb?: LinesChangeCb;

  constructor(maxLines?: number) {
    this.maxLines = maxLines ?? DEFAULT_CONFIG.ROW_COUNT;
    this.scoreTable = this.generateScoreTable();
  }

  private generateScoreTable(): ReadonlyMap<number, number> {
    const scoreTable = new Map<number, number>();
    let preScore = 0;
    for (let i = 1; i <= this.maxLines; i++) {
      const score = preScore + i * 10;
      scoreTable.set(i, preScore + i * 10);
      preScore = score;
    }
    return scoreTable;
  }

  private awardScore(lines: number) {
    const oldScore = this._score;
    this._score += this.scoreTable.get(lines) ?? 0;
    this.scoreChangeCb?.(this._score, oldScore);
  }

  addLines(lines: number) {
    this.awardScore(lines);

    const oldLines = this._lines;
    this._lines += lines;
    this.linesChangeCb?.(this._lines, oldLines);
  }

  reset() {
    const oldScore = this._score;
    const oldLines = this._lines;
    this._score = 0;
    this._lines = 0;
    this.scoreChangeCb?.(this._score, oldScore);
    this.linesChangeCb?.(this._lines, oldLines);
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
