function defeatScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const defeat = manager.getAsset(AssetList.Derrota.name) as p5.Image;

  let interactionCountdown = 30;

  manager.addState(GameStates.DEFEAT_SCREEN, (m) => {
    background(0);

    image(defeat, 0, 0, width, height);

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
