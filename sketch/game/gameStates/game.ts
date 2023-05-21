import { GameManager } from "../../lib/manager";

export const GAME_PLAYING_STATE = "playing-state";

export function game(manager: GameManager) {
  manager.addState(GAME_PLAYING_STATE, (m) => {
    background(200);
  });
}
