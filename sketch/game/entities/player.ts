/// <reference path="../../lib/entity.ts"/>

class Player extends EntityFactory {
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
    walking: {
      cycleName: "walking",
      frames: [0],
      timing: 2,
    },
  };

  static Settings = {
    currentWagon: 1,
    speed: 10,
  };

  static create(manager: GameManager) {
    const player = new Entity(
      "player",
      1,
      { width: 5 * manager.UnitSize, height: 5 * manager.UnitSize * 2 },
      { x: 0, y: (5 * manager.UnitSize) / 2 }
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

    Player.controlListener(manager, player, setCurrentSpriteFunction);

    BaseBehaviors.constrainToScreen(manager, player, true);

    manager.addEntity(player, player.layer);
  }

  static controlListener(
    manager: GameManager,
    player: Entity,
    setCurrentSpriteFunction: (name: string) => void
  ) {
    player.addListener(
      CharacterControl.Events.ControlEvent.name,
      (event: ControllerOptions) => {
        const { isRight, isLeft } = event;

        if (isRight) player.position.x += Player.Settings.speed;
        if (isLeft) player.position.x -= Player.Settings.speed;
      }
    );
  }
}
