function setupFunction(manager: GameManager) {
  const { configs } = manager;
  const clientHeight = document.documentElement.clientHeight;
  const clientWidth = document.documentElement.clientWidth;

  let WIDTH = configs.aspectRatio * clientHeight;
  let HEIGHT = clientHeight;
  if (clientWidth / clientHeight < configs.aspectRatio) {
    WIDTH = clientWidth;
    HEIGHT = clientWidth / configs.aspectRatio;
  }

  createCanvas(WIDTH, HEIGHT);

  manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);

  loadingScreen(manager);
  introSplashScreen(manager);
  titleScreen(manager);
}

function addAssetsToManager(manager: GameManager) {
  for (const asset of Object.keys(AssetList)) {
    const { path } = AssetList[asset];
    manager.addAsset(asset, path);
  }
}
