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
    ctx.fillRect(this.x, this.y, this.size, this.size);

    const sideWidth = this.size * 0.08;
    const sideOpacity = 0.4;

    // top
    ctx.fillStyle = `rgba(255,255,255,${sideOpacity})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.size, this.y);
    ctx.lineTo(this.x + this.size - sideWidth, this.y + sideWidth);
    ctx.lineTo(this.x + sideWidth, this.y + sideWidth);
    ctx.closePath();
    ctx.fill();

    // right
    ctx.fillStyle = `rgba(255,255,255,${sideOpacity})`;
    ctx.beginPath();
    ctx.moveTo(this.x + this.size, this.y);
    ctx.lineTo(this.x + this.size, this.y + this.size);
    ctx.lineTo(this.x + this.size - sideWidth, this.y + this.size - sideWidth);
    ctx.lineTo(this.x + this.size - sideWidth, this.y + sideWidth);
    ctx.closePath();
    ctx.fill();

    // bottom
    ctx.fillStyle = `rgba(0,0,0,${sideOpacity})`;
    ctx.beginPath();
    ctx.moveTo(this.x + this.size, this.y + this.size);
    ctx.lineTo(this.x, this.y + this.size);
    ctx.lineTo(this.x + sideWidth, this.y + this.size - sideWidth);
    ctx.lineTo(this.x + this.size - sideWidth, this.y + this.size - sideWidth);
    ctx.closePath();
    ctx.fill();

    // left
    ctx.fillStyle = `rgba(0,0,0,${sideOpacity})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size);
    ctx.lineTo(this.x, this.y);
    ctx.lineTo(this.x + sideWidth, this.y + sideWidth);
    ctx.lineTo(this.x + sideWidth, this.y + this.size - sideWidth);
    ctx.closePath();
    ctx.fill();

    // debug position
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
