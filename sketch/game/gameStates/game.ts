function gamePlaying(manager: GameManager) {
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(100, 50, 50);
    manager.runEntities();
  });
}
