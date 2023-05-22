let gameManager: GameManager;
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
  gameManager.run();
}
