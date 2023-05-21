const GAME_PLAYING_STATE = "playing-state";

function gamePlaying(manager: GameManager) {
  manager.addState(GAME_PLAYING_STATE, (m) => {
    background(200);
  });
}
