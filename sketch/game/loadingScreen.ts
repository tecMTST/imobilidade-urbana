import { AssetList } from "../assets/assetList";
import { GameManager } from "../lib/manager";
import { GAME_PLAYING_STATE } from "./gameStates/game";
import { INTRO_SCREEN } from "./introSplashScreen";
import { LOGO_NUCLEO } from "./keyEnums";

export const LOADING_STATE = "loading-state";

export function loadingScreen(manager: GameManager) {
  for (const [assetName, asset] of Object.entries(AssetList))
    manager.addAsset(assetName, asset.path);
  manager.loadAssets();

  manager.addState(LOADING_STATE, (m) => {
    const logo = m.getAsset(LOGO_NUCLEO) as p5.Image;
    background(0);
    push();

    translate(width / 2, height / 2);
    image(logo, 0, 0, m.UnitSize, m.UnitSize);
    rectMode(CENTER);
    rect(0, m.UnitSize, m.assetsLoadingProgression * width * 0.9, m.UnitSize);

    pop();

    if (m.assetsLoadingProgression >= 0.99) m.state = INTRO_SCREEN;
  });

  manager.state = LOADING_STATE;
}
