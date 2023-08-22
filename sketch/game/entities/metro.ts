/// <reference path="../../lib/entity.ts"/>

interface MetroContent {
  id: number;
  characters: Entity[];
}

class Metro extends EntityFactory {
  static Behaviors: { [key: string]: string } = {
    TransitionWagon: "transition-wagon",
  };

  static AnimationCycles: { [key: string]: NewCycleInformation } = {
    static: {
      cycleName: "static",
      frames: [0],
      timing: 5,
    },
  };

  static Settings: { vagoes: MetroContent[]; transitionTo: number } = {
    vagoes: [],
    transitionTo: -1,
  };

  static create(manager: GameManager) {
    const metro = new Entity(
      "metro",
      2,
      { width: manager.size.width, height: manager.size.height },
      { x: 0, y: 0 }
    );

    const { CarroMetro } = AssetList;

    const metroSpritesheet = manager.getAsset(CarroMetro.name) as p5.Image;

    const metroTileset = new Tileset(
      metroSpritesheet,
      CarroMetro.originalTileSize,
      CarroMetro.columns
    );

    const { newCycleFunction, setCurrentSpriteFunction } =
      BaseBehaviors.addSpriteAnimation(metro, metroTileset);

    newCycleFunction(Player.AnimationCycles.static);
    setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
    newCycleFunction(Player.AnimationCycles.walking);

    metro.activateBehavior(BaseBehaviors.Names.SpriteAnimation);

    Metro.addVagoes(manager, metro);

    manager.addEntity(metro, metro.layer);
  }

  static metroTransitionBehavior(manager: GameManager, metro: Entity) {
    const player = manager.entities.get("player") as Entity;
    metro.addBehavior(
      Metro.Behaviors.TransitionWagon,
      () => {
        if (
          player.position.x > manager.size.width / 2 - manager.UnitSize &&
          Player.Settings.currentWagon < Metro.Settings.vagoes.length - 1
        )
          Metro.Settings.transitionTo = Player.Settings.currentWagon + 1;
      },
      true
    );
  }

  static addVagoes(manager: GameManager, metro: Entity) {
    const { vagoes } = Metro.Settings;
    vagoes.push({
      id: 0,
      characters: [Pedro.create(manager)],
    });
    vagoes.push({
      id: 1,
      characters: [],
    });
    vagoes.push({
      id: 2,
      characters: [Pedro.create(manager)],
    });
  }
}
