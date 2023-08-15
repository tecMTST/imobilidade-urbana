/// <reference path="../../lib/entity.ts"/>

class Vagao extends EntityFactory {
  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static create(manager: GameManager) {
    const vagao = new Entity(
      "vagao",
      1,
      { width: manager.size.width, height: manager.size.height },
      { x: 0, y: 0 }
    );

    const { CarroMetro } = AssetList;

    const vagaoSpritesheet = manager.getAsset(CarroMetro.name) as p5.Image;

    const vagaoTileset = new Tileset(
      vagaoSpritesheet,
      CarroMetro.originalTileSize,
      CarroMetro.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(vagao, vagaoTileset);

    newCycleFunction(Player.AnimationCycles.static);
    setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
    newCycleFunction(Player.AnimationCycles.walking);

    vagao.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    manager.addEntity(vagao, vagao.layer);
  }
}
