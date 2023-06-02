class ScoreTracker {
  static Behaviors = {
    Display: "display",
  };

  static create(manager: GameManager) {
    const score = new Entity("score-tracker", 0);
    score.position.x = -width / 2;
    score.position.y = -height / 2;

    ScoreTracker.display(manager, score);

    manager.addEntity(score, score.layer);
  }

  static display(manager: GameManager, score: Entity) {
    let copList: Entity[] = [];

    const resetGame = () => {
      Player.MarmitaSettings.timer = Player.MarmitaSettings.maxTime;
      Player.MarmitaSettings.deliverCount = 0;
      for (const cop of copList) {
        manager.removeEntity(cop);
      }
      copList = [];
      manager.getEntity(`cop0`).position.y = -height * 0.8;
      manager.getEntity("player").position.x = 0;
      manager.getEntity("player").position.y = height * 0.4;
    };

    score.addBehavior(
      ScoreTracker.Behaviors.Display,
      (e) => {
        textAlign(LEFT, TOP);
        fill(255);
        textSize(manager.UnitSize / 3);
        text(Player.MarmitaSettings.timer--, 0, 0);
        textAlign(RIGHT);
        text(Player.MarmitaSettings.deliverCount, width, 0);

        if (Player.MarmitaSettings.timer < 2) {
          if (Player.MarmitaSettings.timer === 1) {
            manager.playAudio(AssetList.SireneDerrotaSFX.name);
            for (let i = 1; i < 10; i++) {
              copList.push(Cops.create(manager, Helpers.randSign()));
            }
          }
          const hasEvent = manager.getEvent(
            Cops.Events.CollisionWithPlayer.name
          );
          Player.MarmitaSettings.timer = 0;
          if (hasEvent !== undefined) {
            defeatScreen(manager);
            manager.state = GameStates.DEFEAT_SCREEN;
            resetGame();
          }
        }
        if (Player.MarmitaSettings.deliverCount >= 10) {
          victoryScreen(manager);
          manager.state = GameStates.VICTORY_SCREEN;
          resetGame();
        }
      },
      true
    );
  }
}
