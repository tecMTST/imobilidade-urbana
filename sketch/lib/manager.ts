import * as p5 from "p5";
import { BehaviorFunction, Entity, StateFunction } from "./entity";
import { gameConfig } from "../game/config";

type Layer = Map<string, Entity>;

export class GameManager {
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

  constructor() {
    this.behaviors = new Map();
    this.states = new Map();
    this.assets = new Map();
    this.currentState = "";
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
      this.layers.get(layer).forEach((entity) => entity.run());
  }

  run() {
    for (const behavior of this.behaviors.values()) behavior(this);
    this.states.get(this.currentState)(this);
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
          loadImage(asset, () => this.loadedAssetsCount++)
        );
    }
  }

  get assetsLoadingProgression() {
    return this.loadedAssetsCount / this.assets.size;
  }

  getAsset(assetName: string) {
    return this.assets.get(assetName);
  }
}
