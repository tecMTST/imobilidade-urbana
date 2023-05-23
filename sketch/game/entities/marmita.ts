class Marmitas {
  static Behaviors = {
    Show: "show",
    Hide: "hide",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static create(manager: GameManager) {
    const marmita = new Entity(
      "marmita",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: 0, y: 0 }
    );

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

    manager.addEntity(marmita, marmita.layer);
  }
}
