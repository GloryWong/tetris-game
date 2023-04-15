import { Tetris } from '~/classes/Tetris';

declare global {
  interface Window {
    __tetris__: Tetris;
  }
}
