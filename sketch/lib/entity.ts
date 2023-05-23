type BehaviorFunction<T> = (e: T) => void;
type StateFunction<T> = (e: T) => void;

abstract class EntityFactory {
  static Events?: {
    [key: string]: any;
  };
  static Behaviors?: {
    [key: string]: string;
  };
  static AnimationCycles?: { [key: string]: NewCycleInformation };
  static create: (manager: GameManager) => void;
}

class Entity {
  readonly id: string;
  readonly layer: number;

  readonly tags: string[];

  private activeBehaviors: Set<string>;
  private behaviors: Map<string, BehaviorFunction<Entity>>;
  private states: Map<string, StateFunction<Entity>>;
  private currentState: string;
  private internalFunctions: Map<string, Function>;
  private eventListeners: Map<string, (event: any) => void>;

  positionVector: p5.Vector;
  size: Size;
  rotation: number;

  static Assets = {
    sample: "sample",
  };

  static ERROR = {
    NoBehavior: new Error("Behavior not in entity."),
    NoState: new Error("State not in entity."),
  };

  constructor(
    id: string,
    layer: number,
    size = { width: 0, height: 0 },
    position = { x: 0, y: 0 },
    tags: string[] = [],
    rotation = 0
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
    this.eventListeners = new Map();
    this.tags = tags;

    this.state = "";
    this.addState("", (e) => {});
  }

  setup() {}

  addListener<EventData>(eventName: string, func: (event: EventData) => void) {
    this.eventListeners.set(eventName, func);
  }

  removeListener(eventName: string) {
    this.eventListeners.delete(eventName);
  }

  get position(): PositionCoordinates {
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

  addBehavior(
    name: string,
    behavior: BehaviorFunction<Entity>,
    doActivate = false
  ) {
    this.behaviors.set(name, behavior);
    if (doActivate) this.activateBehavior(name);
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

  run(manager: GameManager) {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);

    for (const [eventName, eventFunc] of this.eventListeners.entries()) {
      const event = manager.getEvent(eventName);
      if (event !== undefined) eventFunc(event);
    }

    for (const behavior of this.activeBehaviors) {
      const behaviorFunction = this.behaviors.get(behavior);
      if (behaviorFunction === undefined)
        throwCustomError(
          Entity.ERROR.NoBehavior,
          `[${behavior}] doesn't exist in [${this.id}].`
        );
      behaviorFunction(this);
    }

    const stateFunction = this.states.get(this.currentState);
    if (stateFunction === undefined)
      throwCustomError(
        Entity.ERROR.NoState,
        `[${this.currentState}] doesn't exist in [${this.id}].`
      );
    stateFunction(this);

    pop();
  }
}
