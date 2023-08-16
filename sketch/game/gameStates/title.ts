function titleScreen(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  let hasRequestedFullScreen = false;

  const tituloImage = manager.getAsset(AssetList.TitleScreen.name) as p5.Image;

  noSmooth();
  manager.addState(GameStates.TITLE_SCREEN, (m) => {
    if (!hasRequestedFullScreen && !document.fullscreenElement)
      makeFullScreen();
    hasRequestedFullScreen = true;

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

function makeFullScreen() {
  const c = document.getElementById("game-canvas");
  c.requestFullscreen();
}
