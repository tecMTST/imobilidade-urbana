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

  static MarmitaSettings = {
    isHolding: false,
    marmita: {},
    timer: 30 * 60,
    deliverCount: 0,
    maxTime: 30 * 60,
  };

  static create(manager: GameManager) {
    const player = new Entity(
      "player",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: 0, y: height * 0.4 }
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

    Player.collisionWithMarmitaListener(manager, player);

    Player.goalListener(manager, player);

    Player.dropMarmitaListener(manager, player);

    Player.listenToCop(manager, player);

    Player.showMarmita(manager, player);

    BaseBehaviors.constrainToScreen(manager, player, true);

    manager.addEntity(player, player.layer);
  }

  static showMarmita(manager: GameManager, player: Entity) {
    const marmitaAsset = AssetList.Marmita;
    const marmitaSprite = manager.getAsset(marmitaAsset.name) as p5.Image;

    const floatingAnimation = Animate.getAnimation(
      Animate.move,
      {
        func: Animate.sine,
        funcArgs: {
          a: 4,
          b: -0.5,
          c: 0,
          d: 0,
        },
      },
      ["y"]
    );
    const posModifier = { position: { y: 0 } };
    player.addBehavior(
      Player.Behaviors.ShowMarmita,
      (e) => {
        if (Player.MarmitaSettings.isHolding) {
          floatingAnimation.apply(posModifier);
          image(
            marmitaSprite,
            0,
            -manager.UnitSize + posModifier.position.y,
            manager.UnitSize * 0.5,
            manager.UnitSize * 0.5
          );
        }
      },
      true
    );
  }

  static listenToCop(manager: GameManager, player: Entity) {
    player.addListener(Cops.Events.CollisionWithPlayer.name, (e) => {
      if (Player.MarmitaSettings.isHolding) {
        manager.playAudio(AssetList.SireneCurta.name);
        manager.playAudio(AssetList.MarmitaPerdida.name, 0.2);
        const marmita = manager.getEntity("marmita") as Entity;
        Player.dropMarmita(marmita);
        BaseBehaviors.shake(manager, 15);
      }
    });
  }

  static dropMarmita(marmita: Entity) {
    Player.MarmitaSettings.isHolding = false;
    // marmita.activateBehavior(BaseBehaviors.Names.Spawn);
  }

  static dropMarmitaListener(manager: GameManager, player: Entity) {
    player.addListener(MarmitaDrop.Events.DropMarmita, (e: any) => {
      const marmita = manager.getEntity("marmita") as Entity;
      Player.dropMarmita(marmita);
    });
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

  static collisionWithMarmitaListener(manager: GameManager, player: Entity) {
    player.addListener(Marmitas.Events.CollisionWithPlayer.name, (e: any) => {
      if (!Player.MarmitaSettings.isHolding) {
        manager.playAudio(AssetList.SireneCurta.name);
        const marmita = e.marmita as Entity;
        Player.MarmitaSettings.isHolding = true;
        Player.MarmitaSettings.marmita = marmita;
      }
    });
  }

  static goalListener(manager: GameManager, player: Entity) {
    player.addListener(Goal.Events.CollisionWithPlayer.name, (e: any) => {
      if (Player.MarmitaSettings.isHolding) {
        manager.playAudio(
          Helpers.randElement([
            AssetList.MarmitaEntregue.name,
            AssetList.MarmitaEntregueAlt.name,
          ])
        );
        e(Helpers.randElement(["a", "b", "c"]));
        const marmita = Player.MarmitaSettings.marmita as Entity;
        Player.dropMarmita(marmita);
        Player.MarmitaSettings.deliverCount++;
      }
    });
  }
}
