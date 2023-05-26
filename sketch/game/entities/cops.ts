class Cops {
  static Behaviors = {
    Walk: "walk",
  };

  static Events = {
    MoveOut: "move-out",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [5],
      timing: 5,
    },
    walking: {
      cycleName: "walking",
      frames: [20, 12],
      timing: 2,
    },
  };

  static CurrentCopID = 0;
  static CopCount = 10;

  static create(
    manager: GameManager,
    range: { min: number; max: number } = { min: 500, max: 1000 }
  ) {
    const widLoc = Helpers.randSign();
    const heiLoc = Helpers.randSign();

    const cop = new Entity(
      `cop${Cops.CurrentCopID++}`,
      3,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      {
        x: widLoc * width + widLoc * Helpers.random(range.min, range.max),
        y: heiLoc * height + heiLoc * Helpers.random(range.min, range.max),
      }
    );

    const { CopAsset } = AssetList;

    const copSpritesheet = manager.getAsset(CopAsset.name) as p5.Image;

    const copTileset = new Tileset(
      copSpritesheet,
      CopAsset.originalTileSize,
      CopAsset.columns
    );

    const {
      newCycleFunction,
      setCurrentSpriteFunction,
    } = BaseBehaviors.addSpriteAnimation(cop, copTileset);

    newCycleFunction(Cops.AnimationCycles.static);
    setCurrentSpriteFunction(Cops.AnimationCycles.static.cycleName);
    newCycleFunction(Cops.AnimationCycles.walking);

    cop.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    Cops.pursuePlayer(manager, cop, setCurrentSpriteFunction);
    Cops.moveAwayListener(manager, cop);

    manager.addEntity(cop, cop.layer);
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

  static pursuePlayer(
    manager: GameManager,
    cop: Entity,
    setCurrentAnimation: (name: string) => void
  ) {
    cop.addBehavior(
      Cops.Behaviors.Walk,
      (e) => {
        if (Player.MarmitaSettings.isHolding) {
          manager.removePermanentEvent(Cops.eventNameFor(cop));
          setCurrentAnimation(Cops.AnimationCycles.walking.cycleName);
          const player = manager.getEntity("player") as Entity;
          const normalPlayerVector = player.position.copy();
          normalPlayerVector
            .sub(cop.position)
            .normalize()
            .mult(manager.UnitSize * 0.06);
          cop.position.add(normalPlayerVector);
          if (normalPlayerVector.x < 0) cop.scale.width = -1;
          else cop.scale.width = 1;
        } else {
          // setCurrentAnimation(Cops.AnimationCycles.static.cycleName);
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
