/// <reference path="../../lib/entity.ts"/>

class Goal extends EntityFactory {
  static Behaviors = {
    EmitPlayerCollision: "emit-collision",
  };

  static Events = {
    CollisionWithPlayer: { name: "goal-collides-with-player", options: {} },
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  create(manager: GameManager) {
    const goal = new Entity(
      "goal",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: 0, y: 0 }
    );

    Goal.drawGoalBehavior(goal, manager);

    manager.addEntity(goal, goal.layer);
  }

  static drawGoalBehavior(goal: Entity, manager: GameManager) {
    const { Marmita } = AssetList;

    const goalSpritesheet = manager.getAsset(Marmita.name) as p5.Image;

    const goalTileset = new Tileset(
      goalSpritesheet,
      Marmita.originalTileSize,
      Marmita.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(goal, goalTileset);

    newCycleFunction(Goal.AnimationCycles.static);
    setCurrentSpriteFunction(Goal.AnimationCycles.static.cycleName);

    goal.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
  }

  static emitPlayerReachedGoal(goal: Entity, manager: GameManager) {
    const player = manager.getEntity("player") as Entity;
    BaseBehaviors.circleCollision(
      manager,
      goal,
      player,
      Goal.Events.CollisionWithPlayer,
      Goal.Behaviors.EmitPlayerCollision,
      true
    );
  }
}
