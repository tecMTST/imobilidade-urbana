const INTRO_SCREEN = "intro-screen";

function introSplashScreen(manager: GameManager) {
  const introSound = manager.getAsset(VINHETA_NUCLEO) as p5.SoundFile;
  const logoNucleo = manager.getAsset(LOGO_NUCLEO) as p5.Image;
  let fadeAlpha = 0;

  manager.addState(INTRO_SCREEN, (m) => {
    background(0);
    image(logoNucleo, 0, 0, manager.UnitSize * 1.5, manager.UnitSize * 1.5);
    manager.playAudio(VINHETA_NUCLEO);
    if (fadeAlpha > 250) manager.state = GAME_PLAYING_STATE;
    fadeAlpha += 2;
    background(0, fadeAlpha);
  });
}
