function gamePlaying(manager: GameManager) {
  let fadeIn = 255;
  let fundoSe = manager.getAsset(AssetList.PracaDaSe.name) as p5.Image;
  manager.addState(GameStates.GAME_PLAYING, (m) => {
    manager.playAudio("OST", 0, true, 0.36);
    image(fundoSe, 0, 0, width, height);
    manager.runEntities();
    if (fadeIn > 0) {
      fadeIn -= gameConfig.fadeInSpeed;
      background(0, fadeIn);
    }
  });
}
