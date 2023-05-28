function gamePlaying(manager: GameManager) {
  let fadeIn = 255;
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(0);
    manager.runEntities();
    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }
  });
}
