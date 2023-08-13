function gameScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const tituloImage = manager.getAsset(AssetList.TitleScreen.name) as p5.Image;

  noSmooth();
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    background(0);

    image(tituloImage, 0, 0, width, height);

    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }

    if (fadeOut > 250) 0; //TODO: NEXT

    if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}
