let gameManager;
function preload() {
    gameManager = new GameManager();
    preloadFunction(gameManager);
}
function setup() {
    noSmooth();
    setupFunction(gameManager);
}
function draw() {
    gameManager.run();
}
const AssetList = {
    PlayerSprite: {
        columns: 8,
        originalTileSize: {
            width: 128,
            height: 256,
        },
        path: "./assets/img/spritesheet_players.png",
    },
};
const gameConfig = {
    aspectRatio: 9 / 16,
    UnitSizeProportion: 0.1,
};
const INTRO_SCREEN = "intro-screen";
function introSplashScreen(manager) {
    const introSound = manager.getAsset(VINHETA_NUCLEO);
    const logoNucleo = manager.getAsset(LOGO_NUCLEO);
    let fadeAlpha = 0;
    manager.addState(INTRO_SCREEN, (m) => {
        background(0);
        image(logoNucleo, 0, 0, manager.UnitSize * 1.5, manager.UnitSize * 1.5);
        manager.playAudio(VINHETA_NUCLEO);
        if (fadeAlpha > 250)
            manager.state = GAME_PLAYING_STATE;
        fadeAlpha += 2;
        background(0, fadeAlpha);
    });
}
const LOGO_NUCLEO = "logo-ntmtst";
const VINHETA_NUCLEO = "vinheta-nucleo";
const LOADING_STATE = "loading-state";
function loadingScreen(manager) {
    for (const [assetName, asset] of Object.entries(AssetList))
        manager.addAsset(assetName, asset.path);
    manager.loadAssets();
    const logo = manager.getAsset(LOGO_NUCLEO);
    let hasInteracted = false;
    manager.addState(LOADING_STATE, (m) => {
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
            m.state = INTRO_SCREEN;
    });
    manager.state = LOADING_STATE;
}
function preloadFunction(manager) {
    const loadingLogo = loadImage("../assets/img/logo-ntmtst.png");
    manager.insertAsset(LOGO_NUCLEO, loadingLogo);
    soundFormats("wav");
    const vinheta = loadSound("../assets/sound/bgm_vinheta.wav");
    manager.insertAsset(VINHETA_NUCLEO, vinheta);
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
    console.log(WIDTH, HEIGHT);
    manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);
    loadingScreen(manager);
    introSplashScreen(manager);
    gamePlaying(manager);
}
const GAME_PLAYING_STATE = "playing-state";
function gamePlaying(manager) {
    manager.addState(GAME_PLAYING_STATE, (m) => {
        background(200);
    });
}
class BaseBehaviors {
    static addSpriteAnimation(entity, tileset) {
        const spriteAnimation = new SpriteAnimation(tileset);
        const behavior = (e) => {
            spriteAnimation.draw(e.position, e.rotation, e.size);
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
}
BaseBehaviors.Names = {
    SpriteAnimation: "sprite-animation",
    AddSpriteCycle: "add-sprite-cycle",
    SetCurrentSpriteCycle: "set-sprite-cycle",
};
class Entity {
    constructor(id, layer, size = { width: 0, height: 0 }, position = { x: 0, y: 0 }, rotation = 0, tags = []) {
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
    setup() { }
    get position() {
        return { x: this.positionVector.x, y: this.positionVector.y };
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
    get state() {
        return this.currentState;
    }
    set state(newState) {
        this.currentState = newState;
    }
    get possibleStates() {
        return new Set(this.states.keys());
    }
    run() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.rotation);
        for (const behavior of this.activeBehaviors) {
            const behaviorFunction = this.behaviors.get(behavior);
            if (behaviorFunction === undefined)
                throwCustomError(Entity.ERROR.NoBehavior, `[${behavior}] doesn't exist in [${this.id}].`);
            behaviorFunction(this);
        }
        const stateFunction = this.states.get(this.currentState);
        if (stateFunction === undefined)
            throwCustomError(Entity.ERROR.NoState, `[${this.currentState}] doesn't exist in [${this.id}].`);
        stateFunction(this);
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
    addEntity(entity, layer) {
        this.entities.set(entity.id, entity);
        if (!this.layers.has(layer))
            this.layers.set(layer, new Map());
        this.layers.get(layer).set(entity.id, entity);
        if (this.existingLayers.indexOf(layer) === -1)
            this.existingLayers.push(layer);
        this.existingLayers.sort();
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
            this.layers.get(layer)?.forEach((entity) => entity.run());
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
        this.current = {
            name,
            idx: 0,
            timeSinceFrame: 0,
        };
    }
    draw(position, rotation, size, opacity = 255) {
        const animationFrames = this.animationCycles.get(this.current.name)?.cycle;
        if (animationFrames === undefined) {
            throwCustomError(SpriteAnimation.ERROR.NoCycle, `Animation cycle called [${this.current.name}] doesn't exist in cycles Map.`);
        }
        const currentSprite = animationFrames[this.current.idx];
        if (animationFrames.length > 1) {
            if (this.current.timeSinceFrame <= 0) {
                const currentCycle = this.animationCycles.get(this.current.name);
                if (currentCycle === undefined)
                    throwCustomError(SpriteAnimation.ERROR.NoCycle, `Cycle with name ${this.current.name} does not exist.`);
                this.current.timeSinceFrame = currentCycle.timeBetweenFrames;
                this.current.idx = (this.current.idx + 1) % animationFrames.length;
            }
            this.current.timeSinceFrame--;
        }
        push();
        tint(255, opacity);
        translate(position.x, position.y);
        rotate(rotation);
        this.tileset.drawTile(currentSprite, { x: 0, y: 0 }, size);
        pop();
    }
}
SpriteAnimation.ERROR = {
    NoCycle: new Error("Animation Cycle doesn't exist."),
};
class Tileset {
    constructor(assetSourcePath, originalTileSize, tilesetColumns) {
        this.sourcePath = assetSourcePath;
        this.sourceSize = originalTileSize;
        this.sourceColumns = tilesetColumns;
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
            tileY: Math.floor(n / this.sourceColumns) * this.sourceSize.width,
        };
    }
}
Tileset.ERROR = {
    NoImage: new Error("No image file in tileset"),
};
//# sourceMappingURL=build.js.map