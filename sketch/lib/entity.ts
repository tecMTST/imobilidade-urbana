import { Size, Position, throwCustomError, ERRORS } from "./helpers";

export type BehaviorFunction<T> = (e: T) => void;
export type StateFunction<T> = (e: T) => void;

export class Entity {
  /**
   * ## Entity abstract class
   *
   * ### Behaviors
   *
   * All behaviors inside `Entity.activeBehaviors` are run at `Entity.run()`.
   *
   * ### States
   *
   * Only `Entity.currentState` is run at `Entity.run()`
   *
   * ### Internal Functions
   *
   * These are never called by the Entity class or its children.
   * They are supposed to be called inside of behavior and state functions.
   *
   * @date 5/4/2023 - 8:38:52 PM
   *
   */
  readonly id: string;
  readonly layer: number;

  readonly tags: string[];

  private activeBehaviors: Set<string>;
  private behaviors: Map<string, BehaviorFunction<Entity>>;
  private states: Map<string, StateFunction<Entity>>;
  private currentState: string;
  private internalFunctions: Map<string, Function>;

  positionVector: p5.Vector;
  size: Size;
  rotation: number;

  reset: () => void;
  setup: () => void;

  static Assets = {
    sample: "sample",
  };

  constructor(
    id: string,
    layer: number,
    size = { width: 0, height: 0 },
    position = { x: 0, y: 0 },
    rotation = 0,
    tags: string[] = []
  ) {
    this.id = id;
    this.positionVector = createVector(position.x, position.y);
    this.size = size;
    this.rotation = rotation;
    this.layer = layer;
    this.behaviors = new Map();
    this.states = new Map();
    this.currentState = "";
    this.activeBehaviors = new Set();
    this.internalFunctions = new Map();
    this.tags = tags;
  }

  get position(): Position {
    return { x: this.positionVector.x, y: this.positionVector.y };
  }

  getFunction(name: string) {
    return this.internalFunctions.get(name);
  }

  addInternalFunction<T>(name: string, func: (param: T) => void) {
    this.internalFunctions.set(name, func);
  }

  removeInternalFunction(name: string) {
    this.internalFunctions.delete(name);
  }

  activateBehavior(name: string) {
    if (!this.behaviors.has(name))
      throwCustomError(
        ERRORS.Entity.NO_BEHAVIOR,
        `Behavior [${name}] is not in entity [${this.id}]`
      );
    this.activeBehaviors.add(name);
  }

  deactivateBehavior(name: string) {
    this.activeBehaviors.delete(name);
  }

  addBehavior(name: string, behavior: BehaviorFunction<Entity>) {
    this.behaviors.set(name, behavior);
  }

  removeBehavior(name: string) {
    this.behaviors.delete(name);
  }

  addState(name: string, state: StateFunction<Entity>) {
    this.states.set(name, state);
  }

  removeState(name: string) {
    this.states.delete(name);
  }

  get state() {
    return this.currentState;
  }

  set state(newState: string) {
    this.currentState = newState;
  }

  get possibleStates() {
    return new Set(this.states.keys());
  }

  run() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);
    for (const behavior of this.activeBehaviors)
      this.behaviors.get(behavior)(this);
    this.states.get(this.currentState)(this);
    pop();
  }
}
