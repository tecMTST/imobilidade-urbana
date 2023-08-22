class Pedro extends EntityFactory {
  static Behaviors = {
    Walk: "walk",
    ShowMarmita: "show-marmita",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static Settings = {};

  static create(manager: GameManager) {
    const pedro = new Entity(
      "pedro",
      1,
      { width: 5 * manager.UnitSize, height: 5 * manager.UnitSize * 2 },
      { x: 0, y: (5 * manager.UnitSize) / 2 }
    );

    const { PedroSprite } = AssetList;

    const pedroSpritesheet = manager.getAsset(PedroSprite.name) as p5.Image;

    const pedroTileset = new Tileset(
      pedroSpritesheet,
      PedroSprite.originalTileSize,
      PedroSprite.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(pedro, pedroTileset);

    newCycleFunction(Pedro.AnimationCycles.static);
    setCurrentSpriteFunction(Pedro.AnimationCycles.static.cycleName);

    pedro.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    BaseBehaviors.constrainToScreen(manager, pedro, true);

    return pedro;
  }
}
