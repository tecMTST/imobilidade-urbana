/// <reference path="../../lib/entity.ts"/>

class Player extends EntityFactory {
  static States = {};

  static Behaviors = {
    Walk: "walk",
    WatchMouse: "watch",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [32],
      timing: 5,
    },
    walking: {
      cycleName: "walking",
      frames: [0, 8],
      timing: 2,
    },
  };

  static create(manager: GameManager) {
    const player = new Entity(
      "player",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
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

    manager.addEntity(player, player.layer);

    let mouseClickTimer = 0;

    player.addBehavior(
      Player.Behaviors.WatchMouse,
      (e) => {
        mouseClickTimer++;
        if (mouseIsPressed && mouseClickTimer < 2)
          setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
        if (!mouseIsPressed) {
          mouseClickTimer = 0;
          setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
        }
      },
      true
    );
  }
}
