/// <reference path="../../lib/entity.ts"/>

class Marmitas extends EntityFactory {
  static Behaviors = {
    Show: "show",
    Collision: "collision",
    Move: "move",
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
      { width: 2 * manager.UnitSize, height: 2 * manager.UnitSize },
      { x: 0, y: -height * 0.2 }
    );

    Marmitas.drawMarmitaBehavior(marmita, manager);
    Marmitas.emitPlayerCollision(marmita, manager);
    // Marmitas.move(manager, marmita);

    manager.addEntity(marmita, marmita.layer);
  }

  static move(manager: GameManager, marmita: Entity) {
    marmita.addBehavior(
      Marmitas.Behaviors.Move,
      (e) => {
        marmita.position.x -= manager.UnitSize / 5;
        if (marmita.position.x < -marmita.size.width - width / 2)
          marmita.position.x = Helpers.random(
            width,
            marmita.size.width + width / 2
          );
      },
      true
    );
  }

  static drawMarmitaBehavior(marmita: Entity, manager: GameManager) {
    const { Carrinho } = AssetList;

    const marmitaSpritesheet = manager.getAsset(Carrinho.name) as p5.Image;

    const marmitaTileset = new Tileset(
      marmitaSpritesheet,
      Carrinho.originalTileSize,
      Carrinho.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(marmita, marmitaTileset);

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
      1,
      true
    );
  }
}
