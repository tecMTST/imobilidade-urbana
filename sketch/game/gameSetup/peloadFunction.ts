function preloadFunction(manager: GameManager) {
  const loadingLogo = loadImage("./assets/img/logo-ntmtst.png");
  manager.insertAsset(GameAssets.LOGO_NUCLEO, loadingLogo);

  // soundFormats("wav");

  //@ts-ignore
  const vinheta: p5.SoundFile = loadSound("./assets/sound/bgm_vinheta.wav");
  manager.insertAsset(GameAssets.VINHETA_NUCLEO, vinheta);
}
