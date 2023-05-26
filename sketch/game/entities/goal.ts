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

  static create(manager: GameManager) {
    const goal = new Entity(
      "goal",
      4,
      { width: manager.UnitSize, height: manager.UnitSize },
      { x: -width * 0.4, y: -height * 0.4 }
    );

    Goal.drawGoalBehavior(goal, manager);
    Goal.emitPlayerReachedGoal(goal, manager);

    manager.addEntity(goal, goal.layer);
  }

  static drawGoalBehavior(goal: Entity, manager: GameManager) {
    const { GoalAsset } = AssetList;

    const goalSpritesheet = manager.getAsset(GoalAsset.name) as p5.Image;

    const goalTileset = new Tileset(
      goalSpritesheet,
      GoalAsset.originalTileSize,
      GoalAsset.columns
    );

    const {
      newCycleFunction,
      setCurrentSpriteFunction,
    } = BaseBehaviors.addSpriteAnimation(goal, goalTileset);

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
