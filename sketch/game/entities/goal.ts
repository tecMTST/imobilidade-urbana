/// <reference path="../../lib/entity.ts"/>

class Goal extends EntityFactory {
  static Behaviors = {
    EmitPlayerCollision: "emit-collision",
    MoveToDestination: "move-destination",
  };

  static Events = {
    CollisionWithPlayer: { name: "goal-collides-with-player", options: {} },
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    a: {
      cycleName: "a",
      frames: [0],
      timing: 5,
    },
    b: {
      cycleName: "b",
      frames: [1],
      timing: 5,
    },
    c: {
      cycleName: "c",
      frames: [2],
      timing: 5,
    },
  };

  static create(
    manager: GameManager,
    origin: PositionCoordinates = { x: -width, y: -height / 4 },
    destination: PositionCoordinates = { x: width, y: -height / 4 },
    id = 1
  ) {
    const goal = new Entity(
      `goal-${id}`,
      4,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: origin.x, y: origin.y }
    );

    goal.scale.width = -1;

    Goal.drawGoalBehavior(goal, manager);
    Goal.emitPlayerReachedGoal(goal, manager);
    // Goal.moveToDestination(goal, manager, origin, destination);

    manager.addEntity(goal, goal.layer);
  }

  static moveToDestination(
    goal: Entity,
    manager: GameManager,
    origin: PositionCoordinates,
    destination: PositionCoordinates
  ) {
    let xDelta = Helpers.random(manager.UnitSize / 4, manager.UnitSize / 7);
    let deltaSign = Math.sign(destination.x);
    const setCurrentAnimation = goal.getFunction(
      BaseBehaviors.Names.SetCurrentSpriteCycle
    );
    goal.addBehavior(
      Goal.Behaviors.MoveToDestination,
      (e) => {
        goal.position.x += xDelta * deltaSign;
        if (Math.abs(goal.position.x) >= Math.abs(destination.x)) {
          xDelta = Helpers.random(manager.UnitSize / 4, manager.UnitSize / 7);
          goal.position.x =
            origin.x - deltaSign * Helpers.random(0, manager.UnitSize * 2);
          const cycle = Helpers.randElement(["a", "b", "c"]);
          setCurrentAnimation(cycle);
        }
      },
      true
    );
  }

  static drawGoalBehavior(goal: Entity, manager: GameManager) {
    const { GoalAsset } = AssetList;

    const goalSpritesheet = manager.getAsset(GoalAsset.name) as p5.Image;

    const goalTileset = new Tileset(
      goalSpritesheet,
      GoalAsset.originalTileSize,
      GoalAsset.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(goal, goalTileset);

    newCycleFunction(Goal.AnimationCycles.a);
    newCycleFunction(Goal.AnimationCycles.b);
    newCycleFunction(Goal.AnimationCycles.c);
    setCurrentSpriteFunction(Helpers.randElement(["a", "b", "c"]));

    // goal.addListener(Goal.Events.CollisionWithPlayer.name, (e) => {
    //   setCurrentSpriteFunction(Helpers.randElement(["a", "b", "c"]));
    // });

    goal.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
  }

  static emitPlayerReachedGoal(goal: Entity, manager: GameManager) {
    const setCurrentSpriteFunction = goal.getFunction(
      BaseBehaviors.Names.SetCurrentSpriteCycle
    );
    const player = manager.getEntity("player") as Entity;
    BaseBehaviors.rectCollision(
      manager,
      goal,
      player,
      {
        name: Goal.Events.CollisionWithPlayer.name,
        options: setCurrentSpriteFunction,
      },
      Goal.Behaviors.EmitPlayerCollision,
      true
    );
  }
}
