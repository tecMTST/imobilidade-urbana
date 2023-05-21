import { GameManager } from "../lib/manager";
import { GAME_PLAYING_STATE } from "./gameStates/game";
import { VINHETA_NUCLEO } from "./keyEnums";

export const INTRO_SCREEN = "intro-screen";

export function introSplashScreen(manager: GameManager) {
  const introSound = manager.getAsset(VINHETA_NUCLEO) as p5.SoundFile;
  manager.addState(INTRO_SCREEN, (m) => {
    introSound.play();
    if (!introSound.isPlaying()) manager.state = GAME_PLAYING_STATE;
  });
}
