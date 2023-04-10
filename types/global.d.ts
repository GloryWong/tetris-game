import { Game } from '~/classes/Game';

declare global {
  interface Window {
    __game__: Game;
  }
}
