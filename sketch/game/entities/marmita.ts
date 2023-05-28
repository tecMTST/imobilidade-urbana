/// <reference path="../../lib/entity.ts"/>

class Marmitas extends EntityFactory {
  static Behaviors = {
    Show: "show",
    Collision: "collision",
    Spawn: "spawn",
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
      name: "marmita-collides-with-player",
      options: {},
    },
  };

  static create(manager: GameManager) {
    const marmita = new Entity(
      "marmita",
      4,
      { width: manager.UnitSize, height: manager.UnitSize },
      { x: 1000, y: 1000 }
    );

    Marmitas.drawMarmitaBehavior(marmita, manager);
    Marmitas.emitPlayerCollision(marmita, manager);
    Marmitas.spawn(marmita, manager);

    manager.addEntity(marmita, marmita.layer);
  }

  static spawn(marmita: Entity, manager: GameManager) {
    marmita.addBehavior(
      Marmitas.Behaviors.Spawn,
      (e) => {
        marmita.position.x = Helpers.random(-width / 2, width / 2);
        marmita.position.y = Helpers.random(height / 4, height / 2);
        marmita.deactivateBehavior(Marmitas.Behaviors.Spawn);
        marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
      },
      true
    );
  }

  static drawMarmitaBehavior(marmita: Entity, manager: GameManager) {
    const { Marmita } = AssetList;

    const marmitaSpritesheet = manager.getAsset(Marmita.name) as p5.Image;

    const marmitaTileset = new Tileset(
      marmitaSpritesheet,
      Marmita.originalTileSize,
      Marmita.columns
    );

    const {
      newCycleFunction,
      setCurrentSpriteFunction,
    } = BaseBehaviors.addSpriteAnimation(marmita, marmitaTileset);

    newCycleFunction(Marmitas.AnimationCycles.static);
    setCurrentSpriteFunction(Marmitas.AnimationCycles.static.cycleName);

    marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
  }

  static emitPlayerCollision(marmita: Entity, manager: GameManager) {
    const player = manager.getEntity("player") as Entity;
    BaseBehaviors.circleCollision(
      manager,
      marmita,
      player,
      { name: Marmitas.Events.CollisionWithPlayer.name, options: { marmita } },
      Marmitas.Behaviors.Collision,
      true
    );
  }
}
