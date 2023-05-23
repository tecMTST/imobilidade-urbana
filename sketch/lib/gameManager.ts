type Layer = Map<string, Entity>;

class GameManager {
  private loadedAssetsCount: number;
  private currentState: string;
  private events: Map<string, any>;

  readonly assets: Map<string, p5.Image | string | p5.SoundFile>;
  readonly configs = gameConfig;

  readonly layers: Map<number, Layer>;
  readonly existingLayers: number[];
  readonly entities: Map<string, Entity>;

  readonly entityGroups: Map<string, Entity>;

  readonly behaviors: Map<string, BehaviorFunction<GameManager>>;
  readonly states: Map<string, StateFunction<GameManager>>;

  private _UnitSize: number;
  private globalVolume = 0.3;

  static ERROR = {
    NoState: new Error("State not in manager."),
  };

  constructor() {
    this.behaviors = new Map();
    this.states = new Map();
    this.assets = new Map();
    this.entityGroups = new Map();
    this.existingLayers = [];
    this.layers = new Map();
    this.entities = new Map();
    this.events = new Map();
    this.loadedAssetsCount = 0;
    this.currentState = "";
    this._UnitSize = 0;
  }

  set volume(v: number) {
    this.globalVolume = v;
  }

  get volume() {
    return this.globalVolume;
  }

  get UnitSize() {
    return this._UnitSize;
  }

  setUnitSize(unitSize: number) {
    this._UnitSize = unitSize;
  }

  addEvent(name: string, options: any) {
    this.events.set(name, options);
  }

  removeEvent(name: string) {
    this.events.delete(name);
  }

  hasEvent(name: string) {
    return this.events.has(name);
  }

  getEvent(name: string) {
    return this.events.get(name);
  }

  addEntity(entity: Entity, layer: number) {
    this.entities.set(entity.id, entity);
    if (!this.layers.has(layer)) this.layers.set(layer, new Map());
    this.layers.get(layer)!.set(entity.id, entity);
    if (this.existingLayers.indexOf(layer) === -1)
      this.existingLayers.push(layer);
    this.existingLayers.sort();

    for (const tag of entity.tags) this.entityGroups.set(tag, entity);
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity.id);
    this.layers.get(entity.layer)!.delete(entity.id);

    for (const tag of entity.tags) this.entityGroups.delete(tag);
  }

  getEntity(name: string) {
    return this.entities.get(name);
  }

  getLayer(layer: number) {
    return this.layers.get(layer);
  }

  addAsset(name: string, path: string) {
    this.assets.set(name, path);
  }

  insertAsset(name: string, file: p5.Image | p5.SoundFile) {
    this.assets.set(name, file);
    this.loadedAssetsCount++;
  }

  addBehavior(name: string, behavior: BehaviorFunction<GameManager>) {
    this.behaviors.set(name, behavior);
  }

  removeBehavior(name: string) {
    this.behaviors.delete(name);
  }

  addState(name: string, state: StateFunction<GameManager>) {
    this.states.set(name, state);
  }

  removeState(name: string) {
    this.states.delete(name);
  }

  runEntities() {
    for (const layer of this.existingLayers)
      this.layers.get(layer)?.forEach((entity) => entity.run(this));
  }

  run() {
    push();

    imageMode(CENTER);
    translate(width / 2, height / 2);
    for (const behavior of this.behaviors.values()) behavior(this);
    const currentStateFunction = this.states.get(this.currentState);
    if (currentStateFunction === undefined)
      throwCustomError(
        GameManager.ERROR.NoState,
        `${this.currentState} doesn't exist.`
      );
    currentStateFunction(this);
    pop();
  }

  set state(state: string) {
    this.currentState = state;
  }

  get state() {
    return this.currentState;
  }

  loadAssets() {
    for (const assetName of this.assets.keys()) {
      const asset = this.assets.get(assetName);
      if (typeof asset === "string")
        this.assets.set(
          assetName,
          loadImage(asset, () => {
            this.loadedAssetsCount++;
            console.log(`Loaded asset ${assetName}`);
          })
        );
    }
  }

  playAudio(audioName: string) {
    const audio = this.assets.get(audioName) as p5.SoundFile;
    audio.setVolume(this.globalVolume);
    if (!audio.isPlaying()) audio.play();
  }

  get assetsLoadingProgression() {
    return this.loadedAssetsCount / this.assets.size;
  }

  getAsset(assetName: string) {
    return this.assets.get(assetName);
  }
}
