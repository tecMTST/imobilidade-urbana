class BaseBehaviors {
  static Names = {
    SpriteAnimation: "sprite-animation",
    AddSpriteCycle: "add-sprite-cycle",
    SetCurrentSpriteCycle: "set-sprite-cycle",
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
      spriteAnimation.draw(e.position, e.rotation, e.size);
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
    doActivate = false
  ) {
    const doesCollide = () => {
      const { x: x0, y: y0 } = entity0.position;
      const { x: x1, y: y1 } = entity1.position;
      return (
        (x0 - x1) ** 2 + (y0 - y1) ** 2 <=
        ((entity0.size.width + entity1.size.width) / 2) ** 2
      );
    };

    entity0.addBehavior(behavior, (e) => {
      const { name, options } = event;
      if (doesCollide) manager.addEvent(name, options);
    });

    if (doActivate) entity0.activateBehavior(behavior);
  }
}
