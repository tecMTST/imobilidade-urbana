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
      frames: [0, 1],
      timing: 2,
    },
  };

  static Settings = {
    currentWagon: 3,
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
        const { currentPress, isPressed } = event;
        const norm = currentPress.copy();

        if (isPressed) {
          norm.div(manager.UnitSize / 8);
          const normalized = norm
            .copy()
            .normalize()
            .mult(manager.UnitSize * 0.05);

          // if (norm.magSq() < manager.UnitSize * 2)
          //   player.position.add(norm.add(normalized));
          // else
          player.position.add(norm.normalize().mult(manager.UnitRoot * 1.4));

          setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
        } else {
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
