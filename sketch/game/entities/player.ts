/// <reference path="../../lib/entity.ts"/>

class Player extends EntityFactory {
  static Behaviors = {
    Walk: "walk",
    Flip: "flip",
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
    staticWithMarmita: {
      cycleName: "static-marmita",
      frames: [18],
      timing: 5,
    },
    walkingWithMarmita: {
      cycleName: "walking-marmita",
      frames: [25, 33],
      timing: 2,
    },
  };

  static MarmitaSettings = {
    isHolding: false,
    marmita: {},
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

    Player.controlListener(manager, player, setCurrentSpriteFunction);

    manager.addEntity(player, player.layer);
  }

  static controlListener(
    manager: GameManager,
    player: Entity,
    setCurrentSpriteFunction: (name: string) => void
  ) {
    player.addListener(
      Joystick.Events.ControlEvent.name,
      (event: ControllerOptions) => {
        const { currentPress, isPressed } = event;
        const norm = currentPress.copy();

        if (isPressed) {
          norm.div(manager.UnitSize / 3);
          player.position.add(norm);
          if (Player.MarmitaSettings.isHolding)
            setCurrentSpriteFunction(
              Player.AnimationCycles.walkingWithMarmita.cycleName
            );
          else
            setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
        } else {
          if (Player.MarmitaSettings.isHolding)
            setCurrentSpriteFunction(
              Player.AnimationCycles.staticWithMarmita.cycleName
            );
          else
            setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
        }

        if (
          (norm.x < 0 && player.scale.width > 0) ||
          (norm.x > 0 && player.scale.width < 0)
        )
          player.scale.width *= -1;
      }
    );
  }
}
