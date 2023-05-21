import { GameManager } from "./lib/manager";
import { preloadFunction } from "./game/peloadFunction";
import { setupFunction } from "./game/setupFunction";

console.log("BBBBBBBB");

let gameManager = new GameManager();

function preload() {
  preloadFunction(gameManager);
}

function setup() {
  setupFunction(gameManager);
}

function draw() {
  gameManager.run();
}
