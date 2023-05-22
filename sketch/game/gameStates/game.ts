function gamePlaying(manager: GameManager) {
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(200);
    manager.runEntities();
  });
}
