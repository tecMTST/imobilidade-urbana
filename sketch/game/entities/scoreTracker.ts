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
      Cops.currentSpeed = 0;
      manager.getEntity(`cop0`).position.y = height / 2 - manager.UnitSize;
      manager.getEntity(`cop0`).position.x = -width / 2 + manager.UnitSize / 2;
      manager.getEntity("player").position.x = 0;
      manager.getEntity("player").position.y = 0;
      Brilho.create(manager);
    };

    const marmitaImage = manager.getAsset(AssetList.Marmita.name) as p5.Image;
    const timerImage = manager.getAsset(AssetList.Timer.name) as p5.Image;
    const volumeOnImage = manager.getAsset(AssetList.Volume.name) as p5.Image;
    const volumeOffImage = manager.getAsset(
      AssetList.VolumeOff.name
    ) as p5.Image;
    const originalVolume = manager.volume;

    const volumeButton = {
      stateImage: volumeOnImage,
      x: width - manager.UnitSize * 0.75,
      y: manager.UnitSize * 0.85,
      size: manager.UnitSize / 2,
      countDown: 0,
    };

    score.addBehavior(
      ScoreTracker.Behaviors.Display,
      (e) => {
        textAlign(LEFT, TOP);
        fill(255);
        textSize(manager.UnitSize / 2);
        Player.MarmitaSettings.timer--;
        // text(Player.MarmitaSettings.timer--, 0, 0);
        // noStroke();
        rect(
          manager.UnitSize * 0.07,
          manager.UnitSize * 0.07,
          ((width - manager.UnitSize * 1.5) * Player.MarmitaSettings.timer) /
            Player.MarmitaSettings.maxTime,
          manager.UnitSize / 2,
          5
        );
        imageMode(CORNER);
        image(
          timerImage,
          manager.UnitSize * 0.13,
          manager.UnitSize * 0.13,
          manager.UnitSize * 0.4,
          manager.UnitSize * 0.4
        );
        textAlign(RIGHT);
        text(
          Player.MarmitaSettings.deliverCount,
          width - manager.UnitSize * 0.1,
          manager.UnitSize * 0.15
        );
        image(
          marmitaImage,
          width - manager.UnitSize,
          manager.UnitSize * 0.1,
          manager.UnitSize / 2,
          manager.UnitSize / 2
        );

        image(
          volumeButton.stateImage,
          volumeButton.x,
          volumeButton.y,
          volumeButton.size,
          volumeButton.size
        );

        volumeButton.countDown++;

        if (
          volumeButton.countDown > 15 &&
          mouseIsPressed &&
          mouseX > volumeButton.x &&
          mouseX < volumeButton.x + volumeButton.size &&
          mouseY > volumeButton.y &&
          mouseY < volumeButton.y + volumeButton.size
        ) {
          volumeButton.countDown = 0;
          if (manager.volume === 0) {
            manager.volume = originalVolume;
            volumeButton.stateImage = volumeOnImage;
          } else {
            manager.volume = 0;
            volumeButton.stateImage = volumeOffImage;
          }
        }

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
