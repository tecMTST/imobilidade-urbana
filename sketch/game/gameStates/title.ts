function titleScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const tituloImage = manager.getAsset(AssetList.TitleScreen.name) as p5.Image;

  noSmooth();
  manager.addState(GameStates.TITLE_SCREEN, (m) => {
    background(0);

    image(tituloImage, 0, 0, width, height);

    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }

    if (fadeOut > 250) manager.state = GameStates.GAME_PLAYING; //TODO: NEXT

    if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}
