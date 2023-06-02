class ScoreTracker {
  static Behaviors = {
    Display: "display",
  };

  static FlyingMarmita = {
    pos: { x: 0, y: 0 },
    rot: 0,
    siz: 0,
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
      Cops.currentSpeed = 0;
      manager.getEntity(`cop0`).position.y = height / 2 - manager.UnitSize;
      manager.getEntity(`cop0`).position.x = -width / 2 + manager.UnitSize / 2;
      manager.getEntity("player").position.x = 0;
      manager.getEntity("player").position.y = height * 0.4;
    };

    const copImage = manager.getAsset(AssetList.Marmita.name) as p5.Image;

    score.addBehavior(
      ScoreTracker.Behaviors.Display,
      (e) => {
        textAlign(LEFT, TOP);
        fill(255);
        textSize(manager.UnitSize / 2);
        text(Player.MarmitaSettings.timer--, 0, 0);
        textAlign(RIGHT);
        text(Player.MarmitaSettings.deliverCount, width, 0);
        image(
          copImage,
          width - manager.UnitSize * 0.75,
          manager.UnitSize / 4,
          manager.UnitSize / 2,
          manager.UnitSize / 2
        );

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

    const fm = ScoreTracker.FlyingMarmita;

    fm.pos.x = 0;
    fm.pos.y = 0;

    // const marmitaAsset = manager.getAsset(AssetList.Marmita)

    score.addListener(Goal.Events.CollisionWithPlayer.name, (e) => {
      push();
      rotate(fm.rot);
      fm.rot += PI * 0.1;
      fm.pos.x += 2;
      fm.siz += 2;
      // image()
      pop();
    });
  }
}
