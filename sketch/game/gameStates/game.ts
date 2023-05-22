function gamePlaying(manager: GameManager) {
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(0);
    manager.runEntities();
  });
}
