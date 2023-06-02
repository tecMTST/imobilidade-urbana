class Brilho {
  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    a: {
      cycleName: "a",
      frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9],
      timing: 1,
    },
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static create(manager: GameManager) {
    const brilho = new Entity(
      `brilho`,
      -1,
      { width: manager.UnitSize * 1.5, height: manager.UnitSize * 1.5 },
      { x: -1000, y: height / 2 - manager.UnitSize * 1.02 }
    );

    const tilesImage = manager.getAsset(AssetList.Brilho.name) as p5.Image;
    const tileset = new Tileset(
      tilesImage,
      AssetList.Brilho.originalTileSize,
      10
    );

    const {
      newCycleFunction,
      setCurrentSpriteFunction,
    } = BaseBehaviors.addSpriteAnimation(brilho, tileset);

    newCycleFunction(Brilho.AnimationCycles.a);
    newCycleFunction(Brilho.AnimationCycles.static);
    setCurrentSpriteFunction("static");

    brilho.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    const timeProp = Brilho.AnimationCycles.a.timing / 30;
    let count = timeProp * 15;
    let deliverCount = 0;

    brilho.addBehavior(
      "listen-to-goal",
      (e) => {
        const event = manager.getEvent(Goal.Events.CollisionWithPlayer.name);
        count += timeProp;
        if (
          (deliverCount < Player.MarmitaSettings.deliverCount ||
            count < timeProp * 14) &&
          (event !== undefined || count < timeProp * 14)
        ) {
          if (deliverCount < Player.MarmitaSettings.deliverCount)
            deliverCount++;
          if (count >= timeProp * 15) {
            const goal = manager.getEntity("goal-1");
            count = 0;
            brilho.position.x = -goal.position.x;
          }
          setCurrentSpriteFunction("a");
        } else {
          setCurrentSpriteFunction("static");
          brilho.position.x = -1000;
        }
      },
      true
    );

    manager.addEntity(brilho, brilho.layer);
  }
}
