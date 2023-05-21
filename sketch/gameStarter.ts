let gameManager: GameManager;
function preload() {
  gameManager = new GameManager();
  preloadFunction(gameManager);
}

function setup() {
  noSmooth();
  setupFunction(gameManager);
}

function draw() {
  gameManager.run();
}
