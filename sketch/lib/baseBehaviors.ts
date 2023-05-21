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
}
