class Cops {
  static Behaviors = {
    Walk: "walk",
    CollidesWithPlayer: "player-collision",
  };

  static Events = {
    MoveOut: "move-out",
    CollisionWithPlayer: { name: "cop-collides-player", options: {} },
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

  static CurrentCopID = 0;
  static CopCount = 1;
  static speedDelta = 0.01;
  static speedLimit = 3.5;
  static currentSpeed = 0;

  static create(
    manager: GameManager,
    initialHei = -1,
    range: { min: number; max: number } = {
      min: manager.UnitSize * 2,
      max: manager.UnitSize * 5,
    },
    exact: PositionCoordinates | undefined = undefined
  ) {
    const widLoc = Helpers.randSign();
    const heiLoc = initialHei;

    let initialPos = {
      x: widLoc * width + widLoc * Helpers.random(range.min, range.max),
      y: heiLoc * height + heiLoc * Helpers.random(range.min, range.max),
    };

    if (exact !== undefined) {
      initialPos = exact;
    }

    const cop = new Entity(
      `cop${Cops.CurrentCopID++}`,
      3,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      initialPos
    );

    const { CopAsset } = AssetList;

    const copSpritesheet = manager.getAsset(CopAsset.name) as p5.Image;

    const copTileset = new Tileset(
      copSpritesheet,
      CopAsset.originalTileSize,
      CopAsset.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(cop, copTileset);

    newCycleFunction(Cops.AnimationCycles.static);
    newCycleFunction(Cops.AnimationCycles.walking);
    setCurrentSpriteFunction(Cops.AnimationCycles.static.cycleName);

    cop.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    Cops.pursuePlayer(manager, cop, setCurrentSpriteFunction);
    // Cops.moveAwayListener(manager, cop);
    Cops.emitCollisionWithPlayer(manager, cop);

    manager.addEntity(cop, cop.layer);
    return cop;
  }

  static moveAwayListener(manager: GameManager, cop: Entity) {
    cop.addListener(
      Cops.eventNameFor(cop),
      (eventOptions: { loc: p5.Vector }) => {
        const { loc } = eventOptions;
        const delta = loc
          .copy()
          .normalize()
          .mult(manager.UnitSize * 0.05);

        if (delta.x < 0) cop.scale.width = -1;
        else cop.scale.width = 1;

        cop.position.add(delta);
      }
    );
  }

  static emitCollisionWithPlayer(manager: GameManager, cop: Entity) {
    const player = manager.getEntity("player") as Entity;
    BaseBehaviors.circleCollision(
      manager,
      cop,
      player,
      Cops.Events.CollisionWithPlayer,
      Cops.Behaviors.CollidesWithPlayer,
      0.5,
      true
    );
  }

  static pursuePlayer(
    manager: GameManager,
    cop: Entity,
    setCurrentAnimation: (name: string) => void
  ) {
    cop.addBehavior(
      Cops.Behaviors.Walk,
      (e) => {
        if (
          Player.MarmitaSettings.isHolding ||
          Player.MarmitaSettings.timer < 2
        ) {
          manager.removePermanentEvent(Cops.eventNameFor(cop));
          setCurrentAnimation(Cops.AnimationCycles.walking.cycleName);
          const player = manager.getEntity("player") as Entity;
          const normalPlayerVector = player.position.copy();
          normalPlayerVector
            .sub(cop.position)
            .normalize()
            .mult(manager.UnitSize * 0.1 + Cops.currentSpeed);

          Cops.currentSpeed += Cops.speedDelta;
          if (Cops.currentSpeed > Cops.speedLimit)
            Cops.currentSpeed = Cops.speedLimit;

          cop.position.add(normalPlayerVector);
          if (normalPlayerVector.x < 0) cop.scale.width = -1;
          else cop.scale.width = 1;
        } else {
          setCurrentAnimation(Cops.AnimationCycles.static.cycleName);
          if (!manager.hasEvent(Cops.eventNameFor(cop))) {
            manager.addEvent(
              Cops.eventNameFor(cop),
              { loc: Cops.randomLoc(manager.UnitSize) },
              true
            );
          }
        }
      },
      true
    );
  }

  private static randomLoc(unit: number) {
    return Helpers.randVector().mult(unit * 5);
  }

  private static eventNameFor(cop: Entity) {
    return `${cop.id}-${Cops.Events.MoveOut}`;
  }
}
