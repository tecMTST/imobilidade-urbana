import { GameManager } from "../lib/manager";
import { introSplashScreen } from "./introSplashScreen";
import { loadingScreen } from "./loadingScreen";

export function setupFunction(manager: GameManager) {
  const { configs } = manager;

  let WIDTH = configs.aspectRatio * window.innerHeight;
  let HEIGHT = window.innerHeight;
  if (window.innerHeight < window.innerWidth) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerWidth / configs.aspectRatio;
  }

  createCanvas(WIDTH, HEIGHT);

  console.log(WIDTH, HEIGHT);

  manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);

  loadingScreen(manager);
  introSplashScreen(manager);
}
