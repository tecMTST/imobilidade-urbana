let gameManager: GameManager;
let startedWithCorrectRotation = false;
let hasRequestedFullScreen = false;

function preload() {
  gameManager = new GameManager();
  preloadFunction(gameManager);
}

function setup() {
  noSmooth();
  frameRate(30);
  setupFunction(gameManager);
}

function draw() {
  if (!startedWithCorrectRotation) if (!handleLandscapeOrientation()) return;
  startedWithCorrectRotation = true;

  const c = document.getElementById("game-canvas");
  if (!hasRequestedFullScreen) {
    //document.fullscreenElement
    c.requestFullscreen();
    hasRequestedFullScreen = true;
  }
  gameManager.run();
}

function handleLandscapeOrientation(): boolean {
  if (
    document.documentElement.clientWidth < document.documentElement.clientHeight
  ) {
    image(
      gameManager.assets.get(AssetList.RotateDevice.name) as p5.Image,
      0,
      0,
      gameManager.size.width,
      gameManager.size.height
    );
    fill(255);
    textSize(gameManager.UnitSize);
    text("rotacione o dispositivo", 0, gameManager.UnitSize);
    return false;
  } else if (
    // if the device did not start with the correct rotation
    !startedWithCorrectRotation &&
    !(
      document.documentElement.clientWidth === gameManager.size.width ||
      document.documentElement.clientHeight === gameManager.size.height
    )
  ) {
    location.reload();
    console.log("refreshing");
  }
  return true;
}
