function loadingScreen(manager: GameManager) {
  for (const [assetName, asset] of Object.entries(AssetList))
    manager.addAsset(assetName, asset.path);
  manager.loadAssets();
  const logo = manager.getAsset(GameAssets.LOGO_NUCLEO) as p5.Image;
  let hasInteracted = false;

  manager.addState(GameStates.LOADING_STATE, (m) => {
    let loadingText = (m.assetsLoadingProgression * 100).toFixed(1) + "%";
    if (mouseIsPressed) hasInteracted = true;

    if (m.assetsLoadingProgression >= 0.99) loadingText = "Toque para iniciar";

    background(0);
    image(logo, 0, 0, m.UnitSize * 3, m.UnitSize * 3);
    rectMode(CENTER);
    fill(90);
    rect(
      0,
      m.UnitSize * 2,
      m.assetsLoadingProgression * width * 0.9,
      m.UnitSize * 0.6,
      5
    );
    textAlign(CENTER, CENTER);
    fill(220);
    textSize(m.UnitSize * 0.4);
    text(loadingText, 0, m.UnitSize * 2);

    if (m.assetsLoadingProgression >= 0.99 && hasInteracted)
      m.state = GameStates.INTRO_SCREEN;
  });

  manager.state = GameStates.LOADING_STATE;

  addEntities(manager);
}

function addEntities(manager: GameManager) {}
