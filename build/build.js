let gameManager;
function preload() {
    gameManager = new GameManager();
    preloadFunction(gameManager);
}
function setup() {
    noSmooth();
    frameRate(30);
    setupFunction(gameManager);
}
function draw() {
    gameManager.run();
}
class EntityFactory {
}
class Entity {
    constructor(id, layer, size = { width: 0, height: 0 }, position = { x: 0, y: 0 }, tags = [], rotation = 0) {
        this.id = id;
        this.positionVector = createVector(position.x, position.y);
        this.size = size;
        this.rotation = rotation;
        this.layer = layer;
        this.behaviors = new Map();
        this.activeBehaviors = new Set();
        this.internalFunctions = new Map();
        this.eventListeners = new Map();
        this.tags = tags;
        this.scale = { width: 1, height: 1 };
    }
    addListener(eventName, func) {
        this.eventListeners.set(eventName, func);
    }
    removeListener(eventName) {
        this.eventListeners.delete(eventName);
    }
    get position() {
        return this.positionVector;
    }
    setPosition(newVector) {
        this.positionVector = newVector;
    }
    getFunction(name) {
        return this.internalFunctions.get(name);
    }
    addInternalFunction(name, func) {
        this.internalFunctions.set(name, func);
    }
    removeInternalFunction(name) {
        this.internalFunctions.delete(name);
    }
    activateBehavior(name) {
        if (!this.behaviors.has(name))
            throwCustomError(ERRORS.Entity.NO_BEHAVIOR, `Behavior [${name}] is not in entity [${this.id}]`);
        this.activeBehaviors.add(name);
    }
    deactivateBehavior(name) {
        this.activeBehaviors.delete(name);
    }
    addBehavior(name, behavior, doActivate = false) {
        this.behaviors.set(name, behavior);
        if (doActivate)
            this.activateBehavior(name);
    }
    removeBehavior(name) {
        this.behaviors.delete(name);
    }
    run(manager) {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.rotation);
        scale(this.scale.width, this.scale.height);
        for (const [eventName, eventFunc] of this.eventListeners.entries()) {
            const event = manager.getEvent(eventName);
            if (event !== undefined)
                eventFunc(event);
        }
        for (const behavior of this.activeBehaviors) {
            const behaviorFunction = this.behaviors.get(behavior);
            if (behaviorFunction === undefined)
                throwCustomError(Entity.ERROR.NoBehavior, `[${behavior}] doesn't exist in [${this.id}].`);
            behaviorFunction(this);
        }
        pop();
    }
}
Entity.Assets = {
    sample: "sample",
};
Entity.ERROR = {
    NoBehavior: new Error("Behavior not in entity."),
    NoState: new Error("State not in entity."),
};
class Joystick extends EntityFactory {
    static create(manager) {
        const joystick = new Entity("joystick", 1, { width: manager.UnitSize, height: manager.UnitSize * 2 }, { x: 0, y: 0 });
        Joystick.controlEvent(manager, joystick);
        Joystick.draw(manager, joystick);
        manager.addEntity(joystick, joystick.layer);
    }
    static draw(manager, joystick) {
        joystick.addListener(Joystick.Events.ControlEvent.name, (options) => {
            const { currentPress } = options;
            if (options.isPressed) {
                fill(255, 90);
                circle(0, 0, manager.UnitSize * 0.7);
                stroke(255, 0, 0);
                strokeWeight(3);
                const norm = currentPress.copy();
                if (norm.x ** 2 + norm.y ** 2 > (manager.UnitSize * 0.3) ** 2)
                    norm.normalize().mult(manager.UnitSize * 0.3);
                line(0, 0, norm.x, norm.y);
                fill(255);
                strokeWeight(1);
                stroke(0);
                circle(norm.x, norm.y, manager.UnitSize * 0.5);
            }
        });
    }
    static controlEvent(manager, joystick) {
        joystick.addBehavior(Joystick.Behaviors.EmitControlEvent, (e) => {
            let options = manager.getEvent(Joystick.Events.ControlEvent.name);
            if (options === undefined) {
                options = {
                    origin: createVector(0, 0),
                    isPressed: false,
                    currentPress: createVector(0, 0),
                };
            }
            const [x, y] = [mouseX, mouseY];
            if (!options.isPressed)
                options.origin = createVector(x - width / 2, y - height / 2);
            options.isPressed = false;
            if (mouseIsPressed) {
                options.isPressed = true;
                options.currentPress = createVector(x - width / 2, y - height / 2);
                options.currentPress.sub(options.origin);
                joystick.setPosition(options.origin);
            }
            manager.addEvent(Joystick.Events.ControlEvent.name, options);
        }, true);
    }
}
Joystick.Behaviors = {
    EmitControlEvent: "control-event",
    Draw: "draw",
};
Joystick.Events = {
    ControlEvent: {
        name: "touch-controls",
        options: {},
    },
};
class Cops {
    static create(manager) { }
}
class Goal extends EntityFactory {
    static create(manager) {
        const goal = new Entity("goal", 2, { width: manager.UnitSize, height: manager.UnitSize }, { x: -width * 0.4, y: -height * 0.4 });
        Goal.drawGoalBehavior(goal, manager);
        Goal.emitPlayerReachedGoal(goal, manager);
        manager.addEntity(goal, goal.layer);
    }
    static drawGoalBehavior(goal, manager) {
        const { Marmita } = AssetList;
        const goalSpritesheet = manager.getAsset(Marmita.name);
        const goalTileset = new Tileset(goalSpritesheet, Marmita.originalTileSize, Marmita.columns);
        const { newCycleFunction, setCurrentSpriteFunction, } = BaseBehaviors.addSpriteAnimation(goal, goalTileset);
        newCycleFunction(Goal.AnimationCycles.static);
        setCurrentSpriteFunction(Goal.AnimationCycles.static.cycleName);
        goal.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
    }
    static emitPlayerReachedGoal(goal, manager) {
        const player = manager.getEntity("player");
        BaseBehaviors.circleCollision(manager, goal, player, Goal.Events.CollisionWithPlayer, Goal.Behaviors.EmitPlayerCollision, true);
    }
}
Goal.Behaviors = {
    EmitPlayerCollision: "emit-collision",
};
Goal.Events = {
    CollisionWithPlayer: { name: "goal-collides-with-player", options: {} },
};
Goal.AnimationCycles = {
    static: {
        cycleName: "static",
        frames: [0],
        timing: 5,
    },
};
class Marmitas extends EntityFactory {
    static create(manager) {
        const marmita = new Entity("marmita", 2, { width: manager.UnitSize, height: manager.UnitSize }, { x: 1000, y: 1000 });
        Marmitas.drawMarmitaBehavior(marmita, manager);
        Marmitas.emitPlayerCollision(marmita, manager);
        Marmitas.spawn(marmita, manager);
        manager.addEntity(marmita, marmita.layer);
    }
    static spawn(marmita, manager) {
        marmita.addBehavior(Marmitas.Behaviors.Spawn, (e) => {
            marmita.position.x = Helpers.random(-width / 2, width / 2);
            marmita.position.y = Helpers.random(height / 4, height / 2);
            marmita.deactivateBehavior(Marmitas.Behaviors.Spawn);
            manager.removeEvent(Marmitas.Events.CollisionWithPlayer.name);
        }, true);
    }
    static drawMarmitaBehavior(marmita, manager) {
        const { Marmita } = AssetList;
        const marmitaSpritesheet = manager.getAsset(Marmita.name);
        const marmitaTileset = new Tileset(marmitaSpritesheet, Marmita.originalTileSize, Marmita.columns);
        const { newCycleFunction, setCurrentSpriteFunction, } = BaseBehaviors.addSpriteAnimation(marmita, marmitaTileset);
        newCycleFunction(Marmitas.AnimationCycles.static);
        setCurrentSpriteFunction(Marmitas.AnimationCycles.static.cycleName);
        marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
    }
    static emitPlayerCollision(marmita, manager) {
        const player = manager.getEntity("player");
        BaseBehaviors.circleCollision(manager, marmita, player, { name: Marmitas.Events.CollisionWithPlayer.name, options: { marmita } }, Marmitas.Behaviors.Collision, true);
    }
}
Marmitas.Behaviors = {
    Show: "show",
    Collision: "collision",
    Spawn: "spawn",
};
Marmitas.AnimationCycles = {
    static: {
        cycleName: "static",
        frames: [0],
        timing: 5,
    },
};
Marmitas.Events = {
    CollisionWithPlayer: {
        name: "marmita-collides-with-player",
        options: {},
    },
};
class Player extends EntityFactory {
    static create(manager) {
        const player = new Entity("player", 1, { width: manager.UnitSize, height: manager.UnitSize * 2 }, { x: 0, y: 0 });
        const { PlayerSprite } = AssetList;
        const playerSpritesheet = manager.getAsset(PlayerSprite.name);
        const playerTileset = new Tileset(playerSpritesheet, PlayerSprite.originalTileSize, PlayerSprite.columns);
        const { newCycleFunction, setCurrentSpriteFunction, } = BaseBehaviors.addSpriteAnimation(player, playerTileset);
        newCycleFunction(Player.AnimationCycles.static);
        setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
        newCycleFunction(Player.AnimationCycles.walking);
        newCycleFunction(Player.AnimationCycles.staticWithMarmita);
        newCycleFunction(Player.AnimationCycles.walkingWithMarmita);
        player.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
        Player.controlListener(manager, player, setCurrentSpriteFunction);
        Player.collisionWithMarmitaListener(manager, player);
        Player.goalListener(manager, player);
        BaseBehaviors.constrainToScreen(manager, player, true);
        manager.addEntity(player, player.layer);
    }
    static controlListener(manager, player, setCurrentSpriteFunction) {
        player.addListener(Joystick.Events.ControlEvent.name, (event) => {
            const { currentPress, isPressed } = event;
            const norm = currentPress.copy();
            if (isPressed) {
                norm.div(manager.UnitSize / 3);
                player.position.add(norm);
                if (Player.MarmitaSettings.isHolding)
                    setCurrentSpriteFunction(Player.AnimationCycles.walkingWithMarmita.cycleName);
                else
                    setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
            }
            else {
                if (Player.MarmitaSettings.isHolding)
                    setCurrentSpriteFunction(Player.AnimationCycles.staticWithMarmita.cycleName);
                else
                    setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
            }
            if ((norm.x < 0 && player.scale.width > 0) ||
                (norm.x > 0 && player.scale.width < 0))
                player.scale.width *= -1;
        });
    }
    static collisionWithMarmitaListener(manager, player) {
        player.addListener(Marmitas.Events.CollisionWithPlayer.name, (e) => {
            const marmita = e.marmita;
            marmita.deactivateBehavior(BaseBehaviors.Names.SpriteAnimation);
            manager.removeEvent(Marmitas.Events.CollisionWithPlayer.name);
            Player.MarmitaSettings.isHolding = true;
            Player.MarmitaSettings.marmita = marmita;
        });
    }
    static goalListener(manager, player) {
        player.addListener(Goal.Events.CollisionWithPlayer.name, (e) => {
            if (Player.MarmitaSettings.isHolding) {
                const marmita = Player.MarmitaSettings.marmita;
                Player.MarmitaSettings.isHolding = false;
                marmita.activateBehavior(Marmitas.Behaviors.Spawn);
                marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
            }
            manager.removeEvent(Goal.Events.CollisionWithPlayer.name);
        });
    }
}
Player.Behaviors = {
    Walk: "walk",
    Flip: "flip",
};
Player.AnimationCycles = {
    static: {
        cycleName: "static",
        frames: [32],
        timing: 5,
    },
    walking: {
        cycleName: "walking",
        frames: [0, 8],
        timing: 2,
    },
    staticWithMarmita: {
        cycleName: "static-marmita",
        frames: [18],
        timing: 5,
    },
    walkingWithMarmita: {
        cycleName: "walking-marmita",
        frames: [25, 33],
        timing: 2,
    },
};
Player.MarmitaSettings = {
    isHolding: false,
    marmita: {},
};
const AssetList = {
    PlayerSprite: {
        columns: 8,
        originalTileSize: {
            width: 128,
            height: 256,
        },
        path: "./assets/img/player.png",
        type: "image",
        name: "PlayerSprite",
    },
    Marmita: {
        columns: 1,
        originalTileSize: {
            width: 360,
            height: 360,
        },
        path: "./assets/img/marmita.png",
        type: "image",
        name: "Marmita",
    },
};
const gameConfig = {
    aspectRatio: 9 / 16,
    UnitSizeProportion: 0.1,
};
const GameAssets = {
    LOGO_NUCLEO: "logo-ntmtst",
    VINHETA_NUCLEO: "vinheta-nucleo",
};
const GameStates = {
    LOADING_STATE: "loading-state",
    INTRO_SCREEN: "intro-screen",
    GAME_PLAYING: "game-playing-state",
};
const GameTags = {
    GCM: "gcm-tag",
    MARMITA: "marmita-tag",
};
function preloadFunction(manager) {
    const loadingLogo = loadImage("./assets/img/logo-ntmtst.png");
    manager.insertAsset(GameAssets.LOGO_NUCLEO, loadingLogo);
    soundFormats("wav");
    const vinheta = loadSound("./assets/sound/bgm_vinheta.wav");
    manager.insertAsset(GameAssets.VINHETA_NUCLEO, vinheta);
}
function setupFunction(manager) {
    const { configs } = manager;
    let WIDTH = configs.aspectRatio * windowHeight;
    let HEIGHT = windowHeight;
    if (windowHeight > windowWidth) {
        WIDTH = windowWidth;
        HEIGHT = windowWidth / configs.aspectRatio;
    }
    createCanvas(WIDTH, HEIGHT);
    manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);
    loadingScreen(manager);
    introSplashScreen(manager);
    gamePlaying(manager);
}
function addAssetsToManager(manager) {
    for (const asset of Object.keys(AssetList)) {
        const { path } = AssetList[asset];
        manager.addAsset(asset, path);
    }
}
function gamePlaying(manager) {
    manager.addState(GameStates.GAME_PLAYING, (m) => {
        background(0);
        manager.runEntities();
    });
}
function introSplashScreen(manager) {
    const logoNucleo = manager.getAsset(GameAssets.LOGO_NUCLEO);
    let fadeAlpha = 0;
    manager.addState(GameStates.INTRO_SCREEN, (m) => {
        background(0);
        image(logoNucleo, 0, 0, manager.UnitSize * 1.5, manager.UnitSize * 1.5);
        manager.playAudio(GameAssets.VINHETA_NUCLEO);
        if (fadeAlpha > 250)
            manager.state = GameStates.GAME_PLAYING;
        fadeAlpha += 5;
        background(0, fadeAlpha);
    });
}
function loadingScreen(manager) {
    for (const [assetName, asset] of Object.entries(AssetList))
        manager.addAsset(assetName, asset.path);
    manager.loadAssets();
    const logo = manager.getAsset(GameAssets.LOGO_NUCLEO);
    let hasInteracted = false;
    manager.addState(GameStates.LOADING_STATE, (m) => {
        let loadingText = (m.assetsLoadingProgression * 100).toFixed(1) + "%";
        if (mouseIsPressed)
            hasInteracted = true;
        if (m.assetsLoadingProgression >= 0.99)
            loadingText = "Toque para iniciar.";
        background(0);
        image(logo, 0, 0, m.UnitSize * 1.5, m.UnitSize * 1.5);
        rectMode(CENTER);
        rect(0, m.UnitSize * 2, m.assetsLoadingProgression * width * 0.9, m.UnitSize / 2);
        textAlign(CENTER, CENTER);
        text(loadingText, 0, m.UnitSize * 2);
        if (m.assetsLoadingProgression >= 0.99 && hasInteracted)
            m.state = GameStates.INTRO_SCREEN;
    });
    manager.state = GameStates.LOADING_STATE;
    addEntities(manager);
}
function addEntities(manager) {
    Player.create(manager);
    Joystick.create(manager);
    Marmitas.create(manager);
    Goal.create(manager);
}
class BaseBehaviors {
    static addSpriteAnimation(entity, tileset) {
        const spriteAnimation = new SpriteAnimation(tileset);
        const behavior = (e) => {
            spriteAnimation.draw(e.size);
        };
        entity.addBehavior(BaseBehaviors.Names.SpriteAnimation, behavior);
        const newCycleFunction = (newCycle) => {
            spriteAnimation.addCycle(newCycle);
        };
        entity.addInternalFunction(BaseBehaviors.Names.AddSpriteCycle, newCycleFunction);
        const setCurrentSpriteFunction = (name) => {
            spriteAnimation.setCurrentAnimation(name);
        };
        entity.addInternalFunction(BaseBehaviors.Names.SetCurrentSpriteCycle, setCurrentSpriteFunction);
        return { newCycleFunction, setCurrentSpriteFunction };
    }
    static circleCollision(manager, entity0, entity1, event, behavior, doActivate = false) {
        const doesCollide = () => {
            const { x: x0, y: y0 } = entity0.position;
            const { x: x1, y: y1 } = entity1.position;
            return ((x0 - x1) ** 2 + (y0 - y1) ** 2 <=
                ((entity0.size.width + entity1.size.width) / 5) ** 2);
        };
        entity0.addBehavior(behavior, (e) => {
            const { name, options } = event;
            if (doesCollide())
                manager.addEvent(name, options);
        });
        if (doActivate)
            entity0.activateBehavior(behavior);
    }
    static constrainToScreen(manager, entity, doActivate = false) {
        entity.addBehavior(BaseBehaviors.Names.ConstrainToScreen, (e) => {
            if (entity.position.x > width / 2)
                entity.position.x = width / 2;
            if (entity.position.x < -width / 2)
                entity.position.x = -width / 2;
            if (entity.position.y > height / 2)
                entity.position.y = height / 2;
            if (entity.position.y < -height / 2)
                entity.position.y = -height / 2;
        }, doActivate);
    }
}
BaseBehaviors.Names = {
    SpriteAnimation: "sprite-animation",
    AddSpriteCycle: "add-sprite-cycle",
    SetCurrentSpriteCycle: "set-sprite-cycle",
    ConstrainToScreen: "constrain-entity-to-screen",
};
class GameManager {
    constructor() {
        this.configs = gameConfig;
        this.globalVolume = 0.3;
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
    set volume(v) {
        this.globalVolume = v;
    }
    get volume() {
        return this.globalVolume;
    }
    get UnitSize() {
        return this._UnitSize;
    }
    setUnitSize(unitSize) {
        this._UnitSize = unitSize;
    }
    addEvent(name, options) {
        this.events.set(name, options);
    }
    removeEvent(name) {
        this.events.delete(name);
    }
    hasEvent(name) {
        return this.events.has(name);
    }
    getEvent(name) {
        return this.events.get(name);
    }
    addEntity(entity, layer) {
        this.entities.set(entity.id, entity);
        if (!this.layers.has(layer))
            this.layers.set(layer, new Map());
        this.layers.get(layer).set(entity.id, entity);
        if (this.existingLayers.indexOf(layer) === -1)
            this.existingLayers.push(layer);
        this.existingLayers.sort().reverse();
        for (const tag of entity.tags)
            this.entityGroups.set(tag, entity);
    }
    removeEntity(entity) {
        this.entities.delete(entity.id);
        this.layers.get(entity.layer).delete(entity.id);
        for (const tag of entity.tags)
            this.entityGroups.delete(tag);
    }
    getEntity(name) {
        return this.entities.get(name);
    }
    getLayer(layer) {
        return this.layers.get(layer);
    }
    addAsset(name, path) {
        this.assets.set(name, path);
    }
    insertAsset(name, file) {
        this.assets.set(name, file);
        this.loadedAssetsCount++;
    }
    addBehavior(name, behavior) {
        this.behaviors.set(name, behavior);
    }
    removeBehavior(name) {
        this.behaviors.delete(name);
    }
    addState(name, state) {
        this.states.set(name, state);
    }
    removeState(name) {
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
        for (const behavior of this.behaviors.values())
            behavior(this);
        const currentStateFunction = this.states.get(this.currentState);
        if (currentStateFunction === undefined)
            throwCustomError(GameManager.ERROR.NoState, `${this.currentState} doesn't exist.`);
        currentStateFunction(this);
        pop();
    }
    set state(state) {
        this.currentState = state;
    }
    get state() {
        return this.currentState;
    }
    loadAssets() {
        for (const assetName of this.assets.keys()) {
            const asset = this.assets.get(assetName);
            if (typeof asset === "string")
                this.assets.set(assetName, loadImage(asset, () => {
                    this.loadedAssetsCount++;
                    console.log(`Loaded asset ${assetName}`);
                }));
        }
    }
    playAudio(audioName) {
        const audio = this.assets.get(audioName);
        audio.setVolume(this.globalVolume);
        if (!audio.isPlaying())
            audio.play();
    }
    get assetsLoadingProgression() {
        return this.loadedAssetsCount / this.assets.size;
    }
    getAsset(assetName) {
        return this.assets.get(assetName);
    }
}
GameManager.ERROR = {
    NoState: new Error("State not in manager."),
};
function throwCustomError(error, message) {
    error.message = message;
    throw error;
}
class Helpers {
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }
    static randint(min, max) {
        return Math.floor(Helpers.random(min, max));
    }
    randElement(list) {
        return list[Helpers.randint(0, list.length)];
    }
}
class ERRORS {
}
ERRORS.Entity = {
    NO_BEHAVIOR: new Error("Entity has no behavior of given name."),
};
class SpriteAnimation {
    constructor(tileset) {
        this.tileset = tileset;
        this.animationCycles = new Map();
        this.current = {
            name: "default",
            idx: 0,
            timeSinceFrame: 0,
        };
    }
    addCycle(cycle) {
        const { cycleName, frames, timing } = cycle;
        this.animationCycles.set(cycleName, {
            cycle: frames,
            timeBetweenFrames: timing,
        });
    }
    setCurrentAnimation(name) {
        if (this.current.name === name)
            return;
        this.current = {
            name,
            idx: 0,
            timeSinceFrame: 0,
        };
    }
    draw(size) {
        const animationFrames = this.animationCycles.get(this.current.name)?.cycle;
        if (animationFrames === undefined) {
            throwCustomError(SpriteAnimation.ERROR.NoCycle, `Animation cycle called [${this.current.name}] doesn't exist in cycles Map.`);
        }
        const currentSprite = animationFrames[this.current.idx];
        if (animationFrames.length > 1) {
            if (this.current.timeSinceFrame < 0) {
                const currentCycle = this.animationCycles.get(this.current.name);
                if (currentCycle === undefined)
                    throwCustomError(SpriteAnimation.ERROR.NoCycle, `Cycle with name ${this.current.name} does not exist.`);
                this.current.timeSinceFrame = currentCycle.timeBetweenFrames;
                this.current.idx = (this.current.idx + 1) % animationFrames.length;
            }
            this.current.timeSinceFrame--;
        }
        this.tileset.drawTile(currentSprite, { x: 0, y: 0 }, size);
    }
}
SpriteAnimation.ERROR = {
    NoCycle: new Error("Animation Cycle doesn't exist."),
};
class Tileset {
    constructor(assetSourcePath, originalTileSize, tilesetColumns) {
        if (typeof assetSourcePath === "string")
            this.sourcePath = assetSourcePath;
        else
            this.image = assetSourcePath;
        this.sourceSize = originalTileSize;
        this.sourceColumns = tilesetColumns;
        this.tilesheetWidth = originalTileSize.width * tilesetColumns;
    }
    preload() {
        this.image = loadImage(this.sourcePath);
    }
    drawTile(n, pos, size) {
        const { x, y } = pos;
        let { tileX, tileY } = this.tileNumToPos(n);
        if (this.image === undefined) {
            throwCustomError(Tileset.ERROR.NoImage, `Tile ${n} could not be drawn.`);
        }
        imageMode(CENTER);
        image(this.image, x, y, size.width, size.height, tileX, tileY, this.sourceSize.width, this.sourceSize.height);
    }
    tileNumToPos(n) {
        return {
            tileX: (n % this.sourceColumns) * this.sourceSize.width,
            tileY: Math.floor(n / this.sourceColumns) * this.sourceSize.height,
        };
    }
}
Tileset.ERROR = {
    NoImage: new Error("No image file in tileset"),
};
//# sourceMappingURL=build.js.map