function gamePlaying(manager: GameManager) {
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(150, 50, 50);
    manager.runEntities();
  });
}
