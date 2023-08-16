let gameManager: GameManager;
let isCorrectRotation = true;

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
  if (
    document.documentElement.clientWidth <
      document.documentElement.clientHeight ||
    !isCorrectRotation
  ) {
    isCorrectRotation = false;
    image(
      gameManager.assets.get(AssetList.RotateDevice.name) as p5.Image,
      0,
      0,
      gameManager.size.width,
      gameManager.size.height
    );
    fill(255);
    textSize(gameManager.UnitSize);
    text(
      "rotacione o dispositivo e recarregue a tela",
      0,
      gameManager.UnitSize
    );
    return;
  }
  gameManager.run();
}
