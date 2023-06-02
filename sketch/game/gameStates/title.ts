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

    if (fadeOut > 250) manager.state = GameStates.TUTORIAL_1;

    if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}

function tutorialScreen1(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const tituloImage = manager.getAsset(AssetList.Tutorial1.name) as p5.Image;

  noSmooth();
  manager.addState(GameStates.TUTORIAL_1, (m) => {
    background(0);

    image(tituloImage, 0, 0, width, height);

    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }

    if (fadeOut > 250) manager.state = GameStates.TUTORIAL_2;

    if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}

function tutorialScreen2(manager: GameManager) {
  let fadeIn = 255;
  let fadeOut = 0;

  const tituloImage = manager.getAsset(AssetList.Tutorial2.name) as p5.Image;

  noSmooth();
  manager.addState(GameStates.TUTORIAL_2, (m) => {
    background(0);

    image(tituloImage, 0, 0, width, height);

    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }

    if (fadeOut > 250) manager.state = GameStates.GAME_PLAYING;

    if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
      fadeOut += gameConfig.fadeInSpeed;
      background(0, fadeOut);
    }
  });
}
