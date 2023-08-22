class BaseBehaviors {
  static Names = {
    SpriteAnimation: "sprite-animation",
    AddSpriteCycle: "add-sprite-cycle",
    SetCurrentSpriteCycle: "set-sprite-cycle",
    ConstrainToScreen: "constrain-entity-to-screen",
    Shake: "shake-base-behavior",
    TrasitionState: "transition-between-states",
    Spawn: "spawn-base-behavior",
  };

  /**
   * Adds sprite animations behavior and auxiliary internal functions to given entity using provided tileset.
   *
   * New animations can be added by calling `Entity.getFunction(BaseBehaviors.Names.AddSpriteCycle)(params)`.
   * Similarly, the current sprite cycle can be set by calling `BaseBehaviors.Names.SetCurrentSpriteCycle`.
   * @date 5/4/2023 - 8:52:10 PM
   *
   * @static
   * @param {Entity} entity
   * @param {Tileset} tileset
   * @return {{ newCycleFunction, setCurrentSpriteFunction }} sprite animation functions
   */
  static addSpriteAnimation(entity: Entity, tileset: Tileset) {
    const spriteAnimation = new SpriteAnimation(tileset);
    const behavior: BehaviorFunction<Entity> = (e) => {
      spriteAnimation.draw(e.size);
    };
    entity.addBehavior(BaseBehaviors.Names.SpriteAnimation, behavior);

    const newCycleFunction = (newCycle: NewCycleInformation) => {
      spriteAnimation.addCycle(newCycle);
    };

    entity.addInternalFunction<NewCycleInformation>(
      BaseBehaviors.Names.AddSpriteCycle,
      newCycleFunction
    );

    const setCurrentSpriteFunction = (name: string) => {
      spriteAnimation.setCurrentAnimation(name);
    };

    entity.addInternalFunction<string>(
      BaseBehaviors.Names.SetCurrentSpriteCycle,
      setCurrentSpriteFunction
    );

    return { newCycleFunction, setCurrentSpriteFunction };
  }

  static circleCollision(
    manager: GameManager,
    entity0: Entity,
    entity1: Entity,
    event: { name: string; options: any },
    behavior: string,
    multiplier = 1,
    doActivate = false
  ) {
    const doesCollide = () => {
      const { x: x0, y: y0 } = entity0.position;
      const { x: x1, y: y1 } = entity1.position;
      return (
        (x0 - x1) ** 2 + (y0 - y1) ** 2 <=
        (((entity0.size.width + entity1.size.width) * multiplier) / 2) ** 2
      );
    };

    entity0.addBehavior(behavior, (e) => {
      const { name, options } = event;
      if (doesCollide()) {
        manager.addEvent(name, options);
      }
    });

    if (doActivate) entity0.activateBehavior(behavior);
  }

  static rectCollision(
    manager: GameManager,
    entity0: Entity,
    entity1: Entity,
    event: { name: string; options: any },
    behavior: string,
    doActivate = false
  ) {
    const pointInRect = (
      x: number,
      y: number,
      rx: number,
      ry: number,
      rw: number,
      rh: number
    ) => {
      return (
        x < rx + rw / 2 && x > rx - rw / 2 && y < ry + rh / 2 && y > ry - rh / 2
      );
    };

    const doesCollide = () => {
      const { x: x0, y: y0 } = entity0.position;
      const { width: w0, height: h0 } = entity0.size;
      const { x: x1, y: y1 } = entity1.position;
      const { width: w1, height: h1 } = entity1.size;
      return (
        pointInRect(x0 - w0 / 2, y0 - h0 / 2, x1, y1, w1, h1) ||
        pointInRect(x0 + w0 / 2, y0 + h0 / 2, x1, y1, w1, h1) ||
        pointInRect(x0 - w0 / 2, y0 + h0 / 2, x1, y1, w1, h1) ||
        pointInRect(x0 + w0 / 2, y0 - h0 / 2, x1, y1, w1, h1) ||
        pointInRect(x0, y0, x1, y1, w1, h1)
      );
    };

    entity0.addBehavior(behavior, (e) => {
      const { name, options } = event;
      // fill(244, 20);
      // circle(0, 0, 10);
      // strokeWeight(1);
      // stroke(255, 0, 0);
      // rectMode(CENTER);
      // rect(0, 0, entity0.size.width, entity0.size.height);
      if (doesCollide()) manager.addEvent(name, options);
    });

    if (doActivate) entity0.activateBehavior(behavior);
  }

  static constrainToScreen(
    manager: GameManager,
    entity: Entity,
    doActivate = false
  ) {
    entity.addBehavior(
      BaseBehaviors.Names.ConstrainToScreen,
      (e) => {
        if (entity.position.x > width / 2 - manager.UnitSize / 2)
          entity.position.x = width / 2 - manager.UnitSize / 2;
        if (entity.position.x < -width / 2 + manager.UnitSize / 2)
          entity.position.x = -width / 2 + manager.UnitSize / 2;
        if (entity.position.y > height / 2 - manager.UnitSize)
          entity.position.y = height / 2 - manager.UnitSize;
        if (entity.position.y < -height * 0.23)
          entity.position.y = -height * 0.23;
      },
      doActivate
    );
  }

  static shake(entity: Entity | GameManager, duration: number) {
    const shakeAnimation = Animate.getAnimation(
      Animate.move,
      {
        func: Animate.sine,
        funcArgs: {
          a: 2,
          b: -1.3,
          c: 0,
          d: 0,
        },
      },
      ["x"]
    );

    let originalPosition = entity.position.x;
    if (entity instanceof GameManager) originalPosition = width / 2;

    // TODO: change to deactivate behavior
    entity.addBehavior(
      BaseBehaviors.Names.Shake,
      (_: any) => {
        if (duration-- < 0) {
          entity.removeBehavior(BaseBehaviors.Names.Shake);
          entity.position.x = originalPosition;
        } else {
          const tempX = { position: { x: 0 } };
          shakeAnimation.apply(tempX);
          entity.position.x = originalPosition + tempX.position.x;
        }
      },
      true
    );
  }

  static spawnAtRegion(
    manager: GameManager,
    entity: Entity,
    widLimit: { min: number; max: number },
    heiLimit: { min: number; max: number }
  ) {
    entity.addBehavior(
      BaseBehaviors.Names.Spawn,
      (e) => {
        entity.position.x = Helpers.random(widLimit.min, widLimit.max);
        entity.position.y = Helpers.random(heiLimit.min, heiLimit.max);
        entity.deactivateBehavior(BaseBehaviors.Names.Spawn);
        entity.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
      },
      true
    );
  }
}
