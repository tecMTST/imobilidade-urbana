function gameScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const vagao = manager.getEntity("vagao") as Entity;

  noSmooth();
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(0);

    manager.runEntities();
  });
}
