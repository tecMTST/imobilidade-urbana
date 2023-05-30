function victoryScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const victory = manager.getAsset(AssetList.Vitoria.name) as p5.Image;

  let interactionCountdown = 30;

  manager.addState(GameStates.VICTORY_SCREEN, (m) => {
    background(0);

    image(victory, 0, 0, width, height);

    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }

    if (fadeOut > 250) {
      manager.state = GameStates.GAME_PLAYING;
      titleScreen(manager);
    }

    if (
      interactionCountdown-- < 0 &&
      (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed)
    ) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}
