/// <reference path="../../lib/entity.ts"/>

class Player extends EntityFactory {
  static Behaviors = {
    Walk: "walk",
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

    const {
      newCycleFunction,
      setCurrentSpriteFunction,
    } = BaseBehaviors.addSpriteAnimation(player, playerTileset);

    newCycleFunction(Player.AnimationCycles.static);
    setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
    newCycleFunction(Player.AnimationCycles.walking);
    newCycleFunction(Player.AnimationCycles.staticWithMarmita);
    newCycleFunction(Player.AnimationCycles.walkingWithMarmita);

    player.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    Player.controlListener(manager, player, setCurrentSpriteFunction);

    Player.collisionWithMarmitaListener(manager, player);

    Player.goalListener(manager, player);

    BaseBehaviors.constrainToScreen(manager, player, true);

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

  static collisionWithMarmitaListener(manager: GameManager, player: Entity) {
    player.addListener(Marmitas.Events.CollisionWithPlayer.name, (e: any) => {
      const marmita = e.marmita as Entity;
      marmita.deactivateBehavior(BaseBehaviors.Names.SpriteAnimation);
      // manager.removeEvent(Marmitas.Events.CollisionWithPlayer.name);
      Player.MarmitaSettings.isHolding = true;
      Player.MarmitaSettings.marmita = marmita;
    });
  }

  static goalListener(manager: GameManager, player: Entity) {
    player.addListener(Goal.Events.CollisionWithPlayer.name, (e: any) => {
      if (Player.MarmitaSettings.isHolding) {
        const marmita = Player.MarmitaSettings.marmita as Entity;
        Player.MarmitaSettings.isHolding = false;
        marmita.activateBehavior(Marmitas.Behaviors.Spawn);
        marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
      }
      // manager.removeEvent(Goal.Events.CollisionWithPlayer.name);
    });
  }
}
