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
    static Events;
    static Behaviors;
    static AnimationCycles;
    static create;
}
class Entity {
    id;
    layer;
    tags;
    activeBehaviors;
    behaviors;
    internalFunctions;
    eventListeners;
    scale;
    positionVector;
    size;
    rotation;
    static Assets = {
        sample: "sample",
    };
    static ERROR = {
        NoBehavior: new Error("Behavior not in entity."),
        NoState: new Error("State not in entity."),
    };
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
                eventFunc(event.options);
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
class Joystick extends EntityFactory {
    static Behaviors = {
        EmitControlEvent: "control-event",
        Draw: "draw",
    };
    static Events = {
        ControlEvent: {
            name: "touch-controls",
            options: {},
        },
    };
    static create(manager) {
        const joystick = new Entity("joystick", 0, { width: manager.UnitSize * 2, height: manager.UnitSize * 3 }, { x: 0, y: 0 });
        Joystick.controlEvent(manager, joystick);
        Joystick.draw(manager, joystick);
        manager.addEntity(joystick, joystick.layer);
    }
    static draw(manager, joystick) {
        const joystickSize = manager.UnitSize * 1.5;
        joystick.addListener(Joystick.Events.ControlEvent.name, (options) => {
            let { currentPress, isPressed } = options;
            if (isPressed) {
                fill(255, 90);
                circle(0, 0, joystickSize);
                stroke(255, 0, 0);
                strokeWeight(3);
                const norm = currentPress.copy();
                if (norm.x ** 2 + norm.y ** 2 > (joystickSize * 0.4) ** 2)
                    norm.normalize().mult(joystickSize * 0.4);
                line(0, 0, norm.x, norm.y);
                fill(255);
                strokeWeight(1);
                stroke(0);
                circle(norm.x, norm.y, joystickSize * 0.7);
            }
        });
    }
    static controlEvent(manager, joystick) {
        joystick.addBehavior(Joystick.Behaviors.EmitControlEvent, (e) => {
            let options = manager.getEvent(Joystick.Events.ControlEvent.name)
                ?.options;
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
            manager.addEvent(Joystick.Events.ControlEvent.name, options, true);
        }, true);
    }
}
class Player extends EntityFactory {
    static Behaviors = {
        Walk: "walk",
        ShowMarmita: "show-marmita",
    };
    static AnimationCycles = {
        static: {
            cycleName: "static",
            frames: [0],
            timing: 5,
        },
        walking: {
            cycleName: "walking",
            frames: [0, 1],
            timing: 2,
        },
    };
    static Settings = {
        currentWagon: 3,
    };
    static create(manager) {
        const player = new Entity("player", 1, { width: manager.UnitSize, height: manager.UnitSize * 2 }, { x: 0, y: 0 });
        const { PlayerSprite } = AssetList;
        const playerSpritesheet = manager.getAsset(PlayerSprite.name);
        const playerTileset = new Tileset(playerSpritesheet, PlayerSprite.originalTileSize, PlayerSprite.columns);
        const { newCycleFunction, setCurrentSpriteFunction, } = BaseBehaviors.addSpriteAnimation(player, playerTileset);
        newCycleFunction(Player.AnimationCycles.static);
        setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
        newCycleFunction(Player.AnimationCycles.walking);
        player.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
        Player.controlListener(manager, player, setCurrentSpriteFunction);
        BaseBehaviors.constrainToScreen(manager, player, true);
        manager.addEntity(player, player.layer);
    }
    static controlListener(manager, player, setCurrentSpriteFunction) {
        player.addListener(Joystick.Events.ControlEvent.name, (event) => {
            const { currentPress, isPressed } = event;
            const norm = currentPress.copy();
            if (isPressed) {
                norm.div(manager.UnitSize / 8);
                const normalized = norm
                    .copy()
                    .normalize()
                    .mult(manager.UnitSize * 0.05);
                player.position.add(norm.normalize().mult(manager.UnitRoot * 1.4));
                setCurrentSpriteFunction(Player.AnimationCycles.walking.cycleName);
            }
            else {
                setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
            }
            if ((norm.x < 0 && player.scale.width > 0) ||
                (norm.x > 0 && player.scale.width < 0))
                player.scale.width *= -1;
        });
    }
}
const AssetList = {
    CarroMetro: {
        columns: 1,
        originalTileSize: {
            width: 360,
            height: 142,
        },
        path: "./assets/img/metro_temp.png",
        type: "image",
        name: "CarroMetro",
    },
    TitleScreen: {
        columns: 1,
        originalTileSize: {
            width: 393,
            height: 410,
        },
        path: "./assets/img/titulo_temp.png",
        type: "image",
        name: "TitleScreen",
    },
    RisadaSFX: {
        columns: 1,
        originalTileSize: {
            width: 288,
            height: 512,
        },
        path: "./assets/sound/bgm_vinheta.wav",
        type: "audio",
        name: "RisadaSFX",
    },
};
const gameConfig = {
    aspectRatio: 16 / 9,
    UnitSizeProportion: 0.07,
    fadeInSpeed: 50,
};
const GameAssets = {
    LOGO_NUCLEO: "logo-ntmtst",
    VINHETA_NUCLEO: "vinheta-nucleo",
};
const GameStates = {
    LOADING_STATE: "loading-state",
    INTRO_SCREEN: "intro-screen",
    GAME_PLAYING: "game-playing-state",
    TITLE_SCREEN: "title-screen",
};
const GameTags = {
    GCM: "gcm-tag",
    MARMITA: "marmita-tag",
};
function preloadFunction(manager) {
    const loadingLogo = loadImage("./assets/img/logo-ntmtst.png");
    manager.insertAsset(GameAssets.LOGO_NUCLEO, loadingLogo);
    const vinheta = loadSound("./assets/sound/bgm_vinheta.wav");
    manager.insertAsset(GameAssets.VINHETA_NUCLEO, vinheta);
}
function setupFunction(manager) {
    const { configs } = manager;
    const clientHeight = document.documentElement.clientHeight;
    const clientWidth = document.documentElement.clientWidth;
    let WIDTH = configs.aspectRatio * clientHeight;
    let HEIGHT = clientHeight;
    if (clientWidth / clientHeight < configs.aspectRatio) {
        WIDTH = clientWidth;
        HEIGHT = clientWidth / configs.aspectRatio;
    }
    createCanvas(WIDTH, HEIGHT);
    manager.setUnitSize(HEIGHT * manager.configs.UnitSizeProportion);
    loadingScreen(manager);
    introSplashScreen(manager);
    titleScreen(manager);
    gameScreen(manager);
}
function addAssetsToManager(manager) {
    for (const asset of Object.keys(AssetList)) {
        const { path } = AssetList[asset];
        manager.addAsset(asset, path);
    }
}
function gameScreen(manager) {
    let fadeIn = 255;
    let fadeOut = 0;
    const tituloImage = manager.getAsset(AssetList.TitleScreen.name);
    noSmooth();
    manager.addState(GameStates.GAME_PLAYING, (m) => {
        background(0);
        image(tituloImage, 0, 0, width, height);
        if (fadeIn > 0) {
            fadeIn -= gameConfig.fadeInSpeed;
            background(0, fadeIn);
        }
        if (fadeOut > 250)
            0;
        if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
            fadeOut += gameConfig.fadeInSpeed;
            background(0, fadeOut);
        }
    });
}
function introSplashScreen(manager) {
    const logoNucleo = manager.getAsset(GameAssets.LOGO_NUCLEO);
    let fadeAlpha = 0;
    manager.position = createVector(width / 2, height / 2);
    manager.addState(GameStates.INTRO_SCREEN, (m) => {
        background(0);
        image(logoNucleo, 0, 0, manager.UnitSize * 3, manager.UnitSize * 3);
        if (fadeAlpha > 250)
            manager.state = GameStates.TITLE_SCREEN;
        fadeAlpha += 10;
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
            loadingText = "Toque para iniciar";
        background(0);
        image(logo, 0, 0, m.UnitSize * 3, m.UnitSize * 3);
        rectMode(CENTER);
        fill(90);
        rect(0, m.UnitSize * 2, m.assetsLoadingProgression * width * 0.9, m.UnitSize * 0.6, 5);
        textAlign(CENTER, CENTER);
        fill(220);
        textSize(m.UnitSize * 0.4);
        text(loadingText, 0, m.UnitSize * 2);
        if (m.assetsLoadingProgression >= 0.99 && hasInteracted)
            m.state = GameStates.INTRO_SCREEN;
    });
    manager.state = GameStates.LOADING_STATE;
    addEntities(manager);
}
function addEntities(manager) { }
function titleScreen(manager) {
    let fadeIn = 255;
    let fadeOut = 0;
    const tituloImage = manager.getAsset(AssetList.TitleScreen.name);
    noSmooth();
    manager.addState(GameStates.TITLE_SCREEN, (m) => {
        background(0);
        image(tituloImage, 0, 0, width, height);
        if (fadeIn > 0) {
            fadeIn -= gameConfig.fadeInSpeed;
            background(0, fadeIn);
        }
        if (fadeOut > 250)
            manager.state = GameStates.GAME_PLAYING;
        if (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed) {
            fadeOut += gameConfig.fadeInSpeed;
            background(0, fadeOut);
        }
    });
}
class Animate {
    static getAnimation(animation, animationConfig, options = []) {
        let currentFrame = 0;
        return {
            apply: (entity) => {
                currentFrame++;
                animation({
                    entity,
                    currentFrame,
                    animationConfig,
                    options,
                });
            },
            reset: () => {
                currentFrame = 0;
            },
            copy: () => Animate.getAnimation(animation, animationConfig, options),
        };
    }
    static sine(x, args) {
        const { a, b, c, d } = args;
        return a * Math.sin(b * x + c) + d;
    }
    static linear(x, args) {
        return x * args.a + args.b;
    }
    static quadratic(x, args) {
        const { a, b, c } = args;
        return a * x * x + b * x + c;
    }
    static turn(entityAnimation) {
        const { func, funcArgs } = entityAnimation.animationConfig;
        const { entity, currentFrame } = entityAnimation;
        entity.rotation = func(currentFrame, funcArgs);
    }
    static stretch(entityAnimation) {
        const { func, funcArgs } = entityAnimation.animationConfig;
        const { entity, currentFrame, options } = entityAnimation;
        for (const side of options) {
            entity.size[side] = func(currentFrame, funcArgs);
        }
    }
    static move(entityAnimation) {
        const { func, funcArgs } = entityAnimation.animationConfig;
        const { entity, currentFrame, options } = entityAnimation;
        for (const direction of options) {
            entity.position[direction] = func(currentFrame, funcArgs);
        }
    }
}
class BaseBehaviors {
    static Names = {
        SpriteAnimation: "sprite-animation",
        AddSpriteCycle: "add-sprite-cycle",
        SetCurrentSpriteCycle: "set-sprite-cycle",
        ConstrainToScreen: "constrain-entity-to-screen",
        Shake: "shake-base-behavior",
        TrasitionState: "transition-between-states",
        Spawn: "spawn-base-behavior",
    };
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
    static circleCollision(manager, entity0, entity1, event, behavior, multiplier = 1, doActivate = false) {
        const doesCollide = () => {
            const { x: x0, y: y0 } = entity0.position;
            const { x: x1, y: y1 } = entity1.position;
            return ((x0 - x1) ** 2 + (y0 - y1) ** 2 <=
                (((entity0.size.width + entity1.size.width) * multiplier) / 2) ** 2);
        };
        entity0.addBehavior(behavior, (e) => {
            const { name, options } = event;
            if (doesCollide()) {
                manager.addEvent(name, options);
            }
        });
        if (doActivate)
            entity0.activateBehavior(behavior);
    }
    static rectCollision(manager, entity0, entity1, event, behavior, doActivate = false) {
        const pointInRect = (x, y, rx, ry, rw, rh) => {
            return (x < rx + rw / 2 && x > rx - rw / 2 && y < ry + rh / 2 && y > ry - rh / 2);
        };
        const doesCollide = () => {
            const { x: x0, y: y0 } = entity0.position;
            const { width: w0, height: h0 } = entity0.size;
            const { x: x1, y: y1 } = entity1.position;
            const { width: w1, height: h1 } = entity1.size;
            return (pointInRect(x0 - w0 / 2, y0 - h0 / 2, x1, y1, w1, h1) ||
                pointInRect(x0 + w0 / 2, y0 + h0 / 2, x1, y1, w1, h1) ||
                pointInRect(x0 - w0 / 2, y0 + h0 / 2, x1, y1, w1, h1) ||
                pointInRect(x0 + w0 / 2, y0 - h0 / 2, x1, y1, w1, h1) ||
                pointInRect(x0, y0, x1, y1, w1, h1));
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
            if (entity.position.x > width / 2 - manager.UnitSize / 2)
                entity.position.x = width / 2 - manager.UnitSize / 2;
            if (entity.position.x < -width / 2 + manager.UnitSize / 2)
                entity.position.x = -width / 2 + manager.UnitSize / 2;
            if (entity.position.y > height / 2 - manager.UnitSize)
                entity.position.y = height / 2 - manager.UnitSize;
            if (entity.position.y < -height * 0.23)
                entity.position.y = -height * 0.23;
        }, doActivate);
    }
    static shake(entity, duration) {
        const shakeAnimation = Animate.getAnimation(Animate.move, {
            func: Animate.sine,
            funcArgs: {
                a: 2,
                b: -1.3,
                c: 0,
                d: 0,
            },
        }, ["x"]);
        let originalPosition = entity.position.x;
        if (entity instanceof GameManager)
            originalPosition = width / 2;
        entity.addBehavior(BaseBehaviors.Names.Shake, (_) => {
            if (duration-- < 0) {
                entity.removeBehavior(BaseBehaviors.Names.Shake);
                entity.position.x = originalPosition;
            }
            else {
                const tempX = { position: { x: 0 } };
                shakeAnimation.apply(tempX);
                entity.position.x = originalPosition + tempX.position.x;
            }
        }, true);
    }
    static spawnAtRegion(manager, entity, widLimit, heiLimit) {
        entity.addBehavior(BaseBehaviors.Names.Spawn, (e) => {
            entity.position.x = Helpers.random(widLimit.min, widLimit.max);
            entity.position.y = Helpers.random(heiLimit.min, heiLimit.max);
            entity.deactivateBehavior(BaseBehaviors.Names.Spawn);
            entity.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
        }, true);
    }
}
class GameManager {
    loadedAssetsCount;
    currentState;
    events;
    assets;
    configs = gameConfig;
    layers;
    existingLayers;
    entities;
    entityGroups;
    behaviors;
    states;
    _UnitSize;
    globalVolume = 0.3;
    _UnitRoot;
    position;
    rotation;
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
        this.position = createVector(0, 0);
        this.rotation = 0;
    }
    get UnitRoot() {
        if (!this._UnitRoot)
            this._UnitRoot = Math.sqrt(this._UnitSize);
        return this._UnitRoot;
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
    addEvent(name, options, isPermanent = false) {
        this.events.set(name, { hasCycled: false, isPermanent, options });
    }
    removeEvent(name) {
        this.events.delete(name);
    }
    removePermanentEvent(name) {
        this.events.delete(name);
    }
    hasEvent(name) {
        return this.events.get(name)?.hasCycled;
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
        for (const [eventName, event] of this.events.entries()) {
            if (event.hasCycled && !event.isPermanent) {
                this.events.delete(eventName);
            }
            else
                event.hasCycled = true;
        }
        push();
        imageMode(CENTER);
        translate(this.position.x, this.position.y);
        rotate(this.rotation);
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
            if (typeof asset === "string") {
                if (AssetList[assetName].type === "image")
                    this.assets.set(assetName, loadImage(asset, () => {
                        this.loadedAssetsCount++;
                        console.log(`Loaded asset ${assetName}`);
                    }));
                else
                    this.assets.set(assetName, loadSound(asset, () => {
                        this.loadedAssetsCount++;
                        console.log(`Loaded asset ${assetName}`);
                    }));
            }
        }
    }
    playAudio(audioName, delay = 0, doLoop = false, volume = this.globalVolume) {
        const audio = this.assets.get(audioName);
        audio.setVolume(volume);
        if (!audio.isPlaying()) {
            if (doLoop)
                audio.loop();
            else
                audio.play(delay);
        }
    }
    get assetsLoadingProgression() {
        return this.loadedAssetsCount / this.assets.size;
    }
    getAsset(assetName) {
        return this.assets.get(assetName);
    }
}
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
    static randSign() {
        return Math.sign(Math.random() - 0.5);
    }
    static randElement(list) {
        return list[Helpers.randint(0, list.length)];
    }
    static randVector() {
        return createVector(Math.random() - 0.5, Math.random() - 0.5).normalize();
    }
}
class ERRORS {
    static Entity = {
        NO_BEHAVIOR: new Error("Entity has no behavior of given name."),
    };
}
class SpriteAnimation {
    current;
    animationCycles;
    tileset;
    static ERROR = {
        NoCycle: new Error("Animation Cycle doesn't exist."),
    };
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
class Tileset {
    sourcePath;
    sourceSize;
    sourceColumns;
    image;
    tilesheetWidth;
    static ERROR = {
        NoImage: new Error("No image file in tileset"),
    };
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
//# sourceMappingURL=build.js.map