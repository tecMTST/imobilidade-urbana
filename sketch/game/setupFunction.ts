function setupFunction(manager: GameManager) {
  const { configs } = manager;

  let WIDTH = configs.aspectRatio * windowHeight;
  let HEIGHT = windowHeight;
  if (windowHeight > windowWidth) {
    WIDTH = windowWidth;
    HEIGHT = windowWidth / configs.aspectRatio;
  }

  createCanvas(WIDTH, HEIGHT);

  console.log(WIDTH, HEIGHT);

  manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);

  loadingScreen(manager);
  introSplashScreen(manager);
  gamePlaying(manager);
}
