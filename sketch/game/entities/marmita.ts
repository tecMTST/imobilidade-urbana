class Marmitas {
  static Behaviors = {
    Show: "show",
    Collision: "collision",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static Events = {
    CollisionWithPlayer: {
      name: "collision-with-player",
      options: {},
    },
  };

  static create(manager: GameManager) {
    const marmita = new Entity(
      "marmita",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: 0, y: 0 }
    );

    Marmitas.drawMarmitaBehavior(marmita, manager);
    Marmitas.emitPlayerCollision(marmita, manager);
    Marmitas.hideListener(marmita, manager);

    manager.addEntity(marmita, marmita.layer);
  }

  static drawMarmitaBehavior(marmita: Entity, manager: GameManager) {
    const { Marmita } = AssetList;

    const marmitaSpritesheet = manager.getAsset(Marmita.name) as p5.Image;

    const marmitaTileset = new Tileset(
      marmitaSpritesheet,
      Marmita.originalTileSize,
      Marmita.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(marmita, marmitaTileset);

    newCycleFunction(Marmitas.AnimationCycles.static);
    setCurrentSpriteFunction(Marmitas.AnimationCycles.static.cycleName);

    marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
  }

  static hideListener(marmita: Entity, manager: GameManager) {
    marmita.addListener(
      Marmitas.Events.CollisionWithPlayer.name,
      (e: typeof this.Events.CollisionWithPlayer) => {
        marmita.deactivateBehavior(Marmitas.Behaviors.Show);
      }
    );
  }

  static emitPlayerCollision(marmita: Entity, manager: GameManager) {
    marmita.addBehavior(Marmitas.Behaviors.Collision, (e) => {
      const { name, options } = Marmitas.Events.CollisionWithPlayer;
      manager.addEvent(name, options);
    });
    marmita.activateBehavior(Marmitas.Behaviors.Collision);
  }
}
