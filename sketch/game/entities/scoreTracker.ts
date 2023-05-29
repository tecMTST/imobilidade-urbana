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
    score.addBehavior(
      ScoreTracker.Behaviors.Display,
      (e) => {
        textAlign(LEFT, TOP);
        fill(255);
        textSize(manager.UnitSize / 3);
        text(Player.MarmitaSettings.timer--, 0, 0);
        textAlign(RIGHT);
        text(Player.MarmitaSettings.deliverCount, width, 0);
        if (Player.MarmitaSettings.timer < 0) {
          defeatScreen(manager);
          manager.state = GameStates.DEFEAT_SCREEN;
          Player.MarmitaSettings.timer = Player.MarmitaSettings.maxTime;
          Player.MarmitaSettings.deliverCount = 0;
        }
        if (Player.MarmitaSettings.deliverCount > 10) {
          victoryScreen(manager);
          manager.state = GameStates.VICTORY_SCREEN;
          Player.MarmitaSettings.timer = Player.MarmitaSettings.maxTime;
          Player.MarmitaSettings.deliverCount = 0;
        }
      },
      true
    );
  }
}
