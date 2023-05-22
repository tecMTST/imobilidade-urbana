function introSplashScreen(manager: GameManager) {
  const logoNucleo = manager.getAsset(GameAssets.LOGO_NUCLEO) as p5.Image;
  let fadeAlpha = 0;

  manager.addState(GameStates.INTRO_SCREEN, (m) => {
    background(0);
    image(logoNucleo, 0, 0, manager.UnitSize * 1.5, manager.UnitSize * 1.5);
    manager.playAudio(GameAssets.VINHETA_NUCLEO);
    if (fadeAlpha > 250) manager.state = GameStates.GAME_PLAYING;
    fadeAlpha += 2;
    background(0, fadeAlpha);
  });
}
