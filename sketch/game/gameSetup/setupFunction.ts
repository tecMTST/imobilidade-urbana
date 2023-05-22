function setupFunction(manager: GameManager) {
  const { configs } = manager;

  let WIDTH = configs.aspectRatio * windowHeight;
  let HEIGHT = windowHeight;
  if (windowHeight > windowWidth) {
    WIDTH = windowWidth;
    HEIGHT = windowWidth / configs.aspectRatio;
  }

  createCanvas(WIDTH, HEIGHT);

  manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);

  loadingScreen(manager);
  introSplashScreen(manager);
  gamePlaying(manager);
}

function addAssetsToManager(manager: GameManager) {
  for (const asset of Object.keys(AssetList)) {
    const { path } = AssetList[asset];
    manager.addAsset(asset, path);
  }
}
