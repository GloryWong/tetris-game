export class Cube {
  readonly ctx;
  x;
  y;
  readonly size;
  readonly color;
  private fillStyle;

  constructor(
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number,
    size: number,
    color: string,
  ) {
    this.ctx = ctx;
    this.size = size;
    this.x = col * this.size;
    this.y = row * this.size;
    this.color = color;
    this.fillStyle = this.color;
  }

  render() {
    const ctx = this.ctx;
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x + 1, this.y + 1, this.size - 1, this.size - 1);
    // ctx.font = '13px serif';
    // ctx.textBaseline = 'top';
    // ctx.fillStyle = 'black';
    // ctx.fillText(this.row + ',' + this.col, this.x + 3, this.y + 10);
    // ctx.fillStyle = 'white';
    // ctx.fillText(this.row + ',' + this.col, this.x + 2, this.y + 9);
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.size, this.size);
  }

  move(row: number, col: number) {
    this.x += col * this.size;
    this.y += row * this.size;
  }

  get col() {
    return this.x / this.size;
  }

  get row() {
    return this.y / this.size;
  }
}
