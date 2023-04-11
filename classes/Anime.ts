export type AnimeStatus = 'ready' | 'running' | 'paused';
export type AnimeAction = (...args: any[]) => any;
export type AnimeStatusChangeCb = (
  status: AnimeStatus,
  oldStatus: AnimeStatus,
) => void;

export class Anime {
  private action: AnimeAction | undefined;
  private startTimestamp = 0;
  private rafId: number | undefined;
  private _status: AnimeStatus = 'ready';

  private statusChangeCb?: AnimeStatusChangeCb;

  constructor(action?: AnimeAction) {
    this.action = action;
  }

  private setStatus(status: AnimeStatus) {
    const oldStatus = this._status;
    this._status = status;
    this.statusChangeCb?.(status, oldStatus);
  }

  protected setAction(action: AnimeAction) {
    this.action = action;
  }

  private autoAction(ts: number) {
    if (ts - this.startTimestamp > 1000 && this._status === 'running') {
      this.action && this.action();
      this.startTimestamp = ts;
    }

    if (this._status === 'ready') return;

    this.rafId = requestAnimationFrame(this.autoAction.bind(this));
  }

  start() {
    if (this._status !== 'ready') return;
    this.setStatus('running');
    this.autoAction(0);
  }

  pause() {
    if (this._status !== 'running') return;
    this.setStatus('paused');
  }

  resume() {
    if (this._status !== 'paused') return;
    this.setStatus('running');
  }

  toggle() {
    if (this._status === 'ready') {
      this.start();
      return;
    }

    if (this._status === 'running') {
      this.pause();
    } else {
      this.resume();
    }
  }

  stop() {
    this.setStatus('ready');
    this.rafId && cancelAnimationFrame(this.rafId);
  }

  get status() {
    return this._status;
  }

  onStatusChange(cb: AnimeStatusChangeCb) {
    this.statusChangeCb = cb;
  }
}
