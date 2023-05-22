class Player {
  static States = {
    Draw: "stopped",
  };

  static Behaviors = {
    Walk: "walk",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [32],
      timing: 15,
    },
    walking: {
      cycleName: "static",
      frames: [0, 8, 16],
      timing: 15,
    },
  };

  static createPlayer(manager: GameManager) {
    const player = new Entity(
      "player",
      1,
      { width: manager.UnitSize, height: manager.UnitSize },
      { x: 0, y: 0 }
    );

    const { PlayerSprite } = AssetList;

    const playerSpritesheet = manager.getAsset(PlayerSprite.name) as p5.Image;

    const playerTileset = new Tileset(
      playerSpritesheet,
      PlayerSprite.originalTileSize,
      PlayerSprite.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(player, playerTileset);

    newCycleFunction(Player.AnimationCycles.static);
    setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
    newCycleFunction(Player.AnimationCycles.walking);

    player.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    player.addBehavior(Player.Behaviors.Walk, (e) => {
      if (mouseIsPressed)
        setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
    });
  }
}
