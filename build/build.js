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
class MarmitaDrop {
    static create(manager) {
        const dropper = new Entity("dropper", 0);
        MarmitaDrop.checkTap(manager, dropper);
        manager.addEntity(dropper, dropper.layer);
    }
    static checkTap(manager, dropper) {
        let countDownTimer = 0;
        dropper.addBehavior(MarmitaDrop.Behaviors.TapCheck, (e) => {
            if (mouseIsPressed)
                countDownTimer++;
            else {
                if (countDownTimer < 5 &&
                    countDownTimer !== 0 &&
                    Player.MarmitaSettings.isHolding) {
                    manager.playAudio(AssetList.MarmitaPerdida.name, 0.2);
                    manager.addEvent(MarmitaDrop.Events.DropMarmita, {});
                }
                countDownTimer = 0;
            }
        }, true);
    }
}
MarmitaDrop.Behaviors = {
    TapCheck: "tap-check",
};
MarmitaDrop.Events = {
    DropMarmita: "drop-marmita",
};
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
Entity.Assets = {
    sample: "sample",
};
Entity.ERROR = {
    NoBehavior: new Error("Behavior not in entity."),
    NoState: new Error("State not in entity."),
};
class Joystick extends EntityFactory {
    static create(manager) {
        const joystick = new Entity("joystick", 0, { width: manager.UnitSize * 2, height: manager.UnitSize * 3 }, { x: 0, y: 0 });
        Joystick.controlEvent(manager, joystick);
        Joystick.draw(manager, joystick);
        manager.addEntity(joystick, joystick.layer);
    }
    static draw(manager, joystick) {
        const joystickSize = manager.UnitSize * 1.5;
        joystick.addListener(Joystick.Events.ControlEvent.name, (options) => {
            const { currentPress, isPressed } = options;
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
    static create(manager, initialHei = -1, range = {
        min: manager.UnitSize * 2,
        max: manager.UnitSize * 5,
    }, exact = undefined) {
        const widLoc = Helpers.randSign();
        const heiLoc = initialHei;
        let initialPos = {
            x: widLoc * width + widLoc * Helpers.random(range.min, range.max),
            y: heiLoc * height + heiLoc * Helpers.random(range.min, range.max),
        };
        if (exact !== undefined) {
            initialPos = exact;
        }
        const cop = new Entity(`cop${Cops.CurrentCopID++}`, 3, { width: manager.UnitSize, height: manager.UnitSize * 2 }, initialPos);
        const { CopAsset } = AssetList;
        const copSpritesheet = manager.getAsset(CopAsset.name);
        const copTileset = new Tileset(copSpritesheet, CopAsset.originalTileSize, CopAsset.columns);
        const { newCycleFunction, setCurrentSpriteFunction } = BaseBehaviors.addSpriteAnimation(cop, copTileset);
        newCycleFunction(Cops.AnimationCycles.static);
        newCycleFunction(Cops.AnimationCycles.walking);
        setCurrentSpriteFunction(Cops.AnimationCycles.static.cycleName);
        cop.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
        Cops.pursuePlayer(manager, cop, setCurrentSpriteFunction);
        Cops.emitCollisionWithPlayer(manager, cop);
        manager.addEntity(cop, cop.layer);
        return cop;
    }
    static moveAwayListener(manager, cop) {
        cop.addListener(Cops.eventNameFor(cop), (eventOptions) => {
            const { loc } = eventOptions;
            const delta = loc
                .copy()
                .normalize()
                .mult(manager.UnitSize * 0.05);
            if (delta.x < 0)
                cop.scale.width = -1;
            else
                cop.scale.width = 1;
            cop.position.add(delta);
        });
    }
    static emitCollisionWithPlayer(manager, cop) {
        const player = manager.getEntity("player");
        BaseBehaviors.circleCollision(manager, cop, player, Cops.Events.CollisionWithPlayer, Cops.Behaviors.CollidesWithPlayer, 0.5, true);
    }
    static pursuePlayer(manager, cop, setCurrentAnimation) {
        cop.addBehavior(Cops.Behaviors.Walk, (e) => {
            if (Player.MarmitaSettings.isHolding ||
                Player.MarmitaSettings.timer < 2) {
                manager.removePermanentEvent(Cops.eventNameFor(cop));
                setCurrentAnimation(Cops.AnimationCycles.walking.cycleName);
                const player = manager.getEntity("player");
                const normalPlayerVector = player.position.copy();
                normalPlayerVector
                    .sub(cop.position)
                    .normalize()
                    .mult(manager.UnitSize * 0.1);
                cop.position.add(normalPlayerVector);
                if (normalPlayerVector.x < 0)
                    cop.scale.width = -1;
                else
                    cop.scale.width = 1;
            }
            else {
                setCurrentAnimation(Cops.AnimationCycles.static.cycleName);
                if (!manager.hasEvent(Cops.eventNameFor(cop))) {
                    manager.addEvent(Cops.eventNameFor(cop), { loc: Cops.randomLoc(manager.UnitSize) }, true);
                }
            }
        }, true);
    }
    static randomLoc(unit) {
        return Helpers.randVector().mult(unit * 5);
    }
    static eventNameFor(cop) {
        return `${cop.id}-${Cops.Events.MoveOut}`;
    }
}
Cops.Behaviors = {
    Walk: "walk",
    CollidesWithPlayer: "player-collision",
};
Cops.Events = {
    MoveOut: "move-out",
    CollisionWithPlayer: { name: "cop-collides-player", options: {} },
};
Cops.AnimationCycles = {
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
Cops.CurrentCopID = 0;
Cops.CopCount = 1;
class Goal extends EntityFactory {
    static create(manager, origin = { x: -width, y: -height / 4 }, destination = { x: width, y: -height / 4 }, id = 1) {
        const goal = new Entity(`goal-${id}`, 4, { width: manager.UnitSize, height: manager.UnitSize * 2 }, { x: origin.x, y: origin.y });
        if (destination.x < 0)
            goal.scale.width = -1;
        Goal.drawGoalBehavior(goal, manager);
        Goal.emitPlayerReachedGoal(goal, manager);
        Goal.moveToDestination(goal, manager, origin, destination);
        manager.addEntity(goal, goal.layer);
    }
    static moveToDestination(goal, manager, origin, destination) {
        let xDelta = Helpers.random(manager.UnitSize / 4, manager.UnitSize / 7);
        let deltaSign = Math.sign(destination.x);
        const setCurrentAnimation = goal.getFunction(BaseBehaviors.Names.SetCurrentSpriteCycle);
        goal.addBehavior(Goal.Behaviors.MoveToDestination, (e) => {
            goal.position.x += xDelta * deltaSign;
            if (Math.abs(goal.position.x) >= Math.abs(destination.x)) {
                xDelta = Helpers.random(manager.UnitSize / 4, manager.UnitSize / 7);
                goal.position.x =
                    origin.x - deltaSign * Helpers.random(0, manager.UnitSize * 2);
                const cycle = Helpers.randElement(["a", "b", "c"]);
                setCurrentAnimation(cycle);
            }
        }, true);
    }
    static drawGoalBehavior(goal, manager) {
        const { GoalAsset } = AssetList;
        const goalSpritesheet = manager.getAsset(GoalAsset.name);
        const goalTileset = new Tileset(goalSpritesheet, GoalAsset.originalTileSize, GoalAsset.columns);
        const { newCycleFunction, setCurrentSpriteFunction } = BaseBehaviors.addSpriteAnimation(goal, goalTileset);
        newCycleFunction(Goal.AnimationCycles.a);
        newCycleFunction(Goal.AnimationCycles.b);
        newCycleFunction(Goal.AnimationCycles.c);
        setCurrentSpriteFunction(Helpers.randElement(["a", "b", "c"]));
        goal.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
    }
    static emitPlayerReachedGoal(goal, manager) {
        const player = manager.getEntity("player");
        BaseBehaviors.rectCollision(manager, goal, player, Goal.Events.CollisionWithPlayer, Goal.Behaviors.EmitPlayerCollision, true);
    }
}
Goal.Behaviors = {
    EmitPlayerCollision: "emit-collision",
    MoveToDestination: "move-destination",
};
Goal.Events = {
    CollisionWithPlayer: { name: "goal-collides-with-player", options: {} },
};
Goal.AnimationCycles = {
    a: {
        cycleName: "a",
        frames: [0],
        timing: 5,
    },
    b: {
        cycleName: "b",
        frames: [1],
        timing: 5,
    },
    c: {
        cycleName: "c",
        frames: [2],
        timing: 5,
    },
};
class Marmitas extends EntityFactory {
    static create(manager) {
        const marmita = new Entity("marmita", 4, { width: 2 * manager.UnitSize, height: 2 * manager.UnitSize }, { x: 0, y: -height * 0.2 });
        Marmitas.drawMarmitaBehavior(marmita, manager);
        Marmitas.emitPlayerCollision(marmita, manager);
        manager.addEntity(marmita, marmita.layer);
    }
    static move(manager, marmita) {
        marmita.addBehavior(Marmitas.Behaviors.Move, (e) => {
            marmita.position.x -= manager.UnitSize / 5;
            if (marmita.position.x < -marmita.size.width - width / 2)
                marmita.position.x = Helpers.random(width, marmita.size.width + width / 2);
        }, true);
    }
    static drawMarmitaBehavior(marmita, manager) {
        const { Carrinho } = AssetList;
        const marmitaSpritesheet = manager.getAsset(Carrinho.name);
        const marmitaTileset = new Tileset(marmitaSpritesheet, Carrinho.originalTileSize, Carrinho.columns);
        const { newCycleFunction, setCurrentSpriteFunction } = BaseBehaviors.addSpriteAnimation(marmita, marmitaTileset);
        newCycleFunction(Marmitas.AnimationCycles.static);
        setCurrentSpriteFunction(Marmitas.AnimationCycles.static.cycleName);
        marmita.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
    }
    static emitPlayerCollision(marmita, manager) {
        const player = manager.getEntity("player");
        BaseBehaviors.circleCollision(manager, marmita, player, { name: Marmitas.Events.CollisionWithPlayer.name, options: { marmita } }, Marmitas.Behaviors.Collision, 1, true);
    }
}
Marmitas.Behaviors = {
    Show: "show",
    Collision: "collision",
    Move: "move",
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
        const player = new Entity("player", 1, { width: manager.UnitSize, height: manager.UnitSize * 2 }, { x: 0, y: height * 0.4 });
        const { PlayerSprite } = AssetList;
        const playerSpritesheet = manager.getAsset(PlayerSprite.name);
        const playerTileset = new Tileset(playerSpritesheet, PlayerSprite.originalTileSize, PlayerSprite.columns);
        const { newCycleFunction, setCurrentSpriteFunction } = BaseBehaviors.addSpriteAnimation(player, playerTileset);
        newCycleFunction(Player.AnimationCycles.static);
        setCurrentSpriteFunction(Player.AnimationCycles.static.cycleName);
        newCycleFunction(Player.AnimationCycles.walking);
        player.activateBehavior(BaseBehaviors.Names.SpriteAnimation);
        Player.controlListener(manager, player, setCurrentSpriteFunction);
        Player.collisionWithMarmitaListener(manager, player);
        Player.goalListener(manager, player);
        Player.dropMarmitaListener(manager, player);
        Player.listenToCop(manager, player);
        Player.showMarmita(manager, player);
        BaseBehaviors.constrainToScreen(manager, player, true);
        manager.addEntity(player, player.layer);
    }
    static showMarmita(manager, player) {
        const marmitaAsset = AssetList.Marmita;
        const marmitaSprite = manager.getAsset(marmitaAsset.name);
        const floatingAnimation = Animate.getAnimation(Animate.move, {
            func: Animate.sine,
            funcArgs: {
                a: 4,
                b: -0.5,
                c: 0,
                d: 0,
            },
        }, ["y"]);
        const posModifier = { position: { y: 0 } };
        player.addBehavior(Player.Behaviors.ShowMarmita, (e) => {
            if (Player.MarmitaSettings.isHolding) {
                floatingAnimation.apply(posModifier);
                image(marmitaSprite, 0, -manager.UnitSize + posModifier.position.y, manager.UnitSize * 0.5, manager.UnitSize * 0.5);
            }
        }, true);
    }
    static listenToCop(manager, player) {
        player.addListener(Cops.Events.CollisionWithPlayer.name, (e) => {
            if (Player.MarmitaSettings.isHolding) {
                manager.playAudio(AssetList.SireneCurta.name);
                manager.playAudio(AssetList.MarmitaPerdida.name, 0.2);
                const marmita = manager.getEntity("marmita");
                Player.dropMarmita(marmita);
                BaseBehaviors.shake(manager, 15);
            }
        });
    }
    static dropMarmita(marmita) {
        Player.MarmitaSettings.isHolding = false;
    }
    static dropMarmitaListener(manager, player) {
        player.addListener(MarmitaDrop.Events.DropMarmita, (e) => {
            const marmita = manager.getEntity("marmita");
            Player.dropMarmita(marmita);
        });
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
                if (norm.magSq() < manager.UnitSize * 2)
                    player.position.add(norm.add(normalized));
                else
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
    static collisionWithMarmitaListener(manager, player) {
        player.addListener(Marmitas.Events.CollisionWithPlayer.name, (e) => {
            if (!Player.MarmitaSettings.isHolding) {
                manager.playAudio(AssetList.RetiradaSFX.name);
                const marmita = e.marmita;
                Player.MarmitaSettings.isHolding = true;
                Player.MarmitaSettings.marmita = marmita;
            }
        });
    }
    static goalListener(manager, player) {
        player.addListener(Goal.Events.CollisionWithPlayer.name, (e) => {
            if (Player.MarmitaSettings.isHolding) {
                manager.playAudio(Helpers.randElement([
                    AssetList.MarmitaEntregue.name,
                    AssetList.MarmitaEntregueAlt.name,
                ]));
                const marmita = Player.MarmitaSettings.marmita;
                Player.dropMarmita(marmita);
                Player.MarmitaSettings.deliverCount++;
            }
        });
    }
}
Player.Behaviors = {
    Walk: "walk",
    ShowMarmita: "show-marmita",
};
Player.AnimationCycles = {
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
Player.MarmitaSettings = {
    isHolding: false,
    marmita: {},
    timer: 30 * 60,
    deliverCount: 0,
    maxTime: 30 * 60,
};
class ScoreTracker {
    static create(manager) {
        const score = new Entity("score-tracker", 0);
        score.position.x = -width / 2;
        score.position.y = -height / 2;
        ScoreTracker.display(manager, score);
        manager.addEntity(score, score.layer);
    }
    static display(manager, score) {
        let copList = [];
        const resetGame = () => {
            Player.MarmitaSettings.timer = Player.MarmitaSettings.maxTime;
            Player.MarmitaSettings.deliverCount = 0;
            for (const cop of copList) {
                manager.removeEntity(cop);
            }
            copList = [];
            manager.getEntity(`cop0`).position.y = -height * 0.8;
            manager.getEntity("player").position.x = 0;
            manager.getEntity("player").position.y = height * 0.4;
        };
        score.addBehavior(ScoreTracker.Behaviors.Display, (e) => {
            textAlign(LEFT, TOP);
            fill(255);
            textSize(manager.UnitSize / 3);
            text(Player.MarmitaSettings.timer--, 0, 0);
            textAlign(RIGHT);
            text(Player.MarmitaSettings.deliverCount, width, 0);
            if (Player.MarmitaSettings.timer < 2) {
                if (Player.MarmitaSettings.timer === 1) {
                    manager.playAudio(AssetList.SireneDerrotaSFX.name);
                    for (let i = 1; i < 10; i++) {
                        copList.push(Cops.create(manager, Helpers.randSign()));
                    }
                }
                const hasEvent = manager.getEvent(Cops.Events.CollisionWithPlayer.name);
                Player.MarmitaSettings.timer = 0;
                if (hasEvent !== undefined) {
                    defeatScreen(manager);
                    manager.state = GameStates.DEFEAT_SCREEN;
                    resetGame();
                }
            }
            if (Player.MarmitaSettings.deliverCount > 10) {
                victoryScreen(manager);
                manager.state = GameStates.VICTORY_SCREEN;
                resetGame();
            }
        }, true);
    }
}
ScoreTracker.Behaviors = {
    Display: "display",
};
const AssetList = {
    OST: {
        columns: 1,
        originalTileSize: {
            width: 288,
            height: 512,
        },
        path: "./assets/sound/qtf.mp3",
        type: "audio",
        name: "OST",
    },
    PracaDaSe: {
        columns: 1,
        originalTileSize: {
            width: 288,
            height: 512,
        },
        path: "./assets/img/praca_da_se.png",
        type: "image",
        name: "PracaDaSe",
    },
    MarmitaEntregueAlt: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/marmita_entrega_2.wav",
        type: "audio",
        name: "MarmitaEntregueAlt",
    },
    MarmitaEntregue: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/marmita_entrega_1.wav",
        type: "audio",
        name: "MarmitaEntregue",
    },
    SireneCurta: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/sirene_curta_1.wav",
        type: "audio",
        name: "SireneCurta",
    },
    MarmitaPerdida: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/marmita_perdida.wav",
        type: "audio",
        name: "MarmitaPerdida",
    },
    RetiradaSFX: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/marmita_retirada.wav",
        type: "audio",
        name: "RetiradaSFX",
    },
    SireneDerrotaSFX: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/sound/sirene_longa_1.wav",
        type: "audio",
        name: "SireneDerrotaSFX",
    },
    PlayerSprite: {
        columns: 2,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/img/tia cozinha-Sheet.png",
        type: "image",
        name: "PlayerSprite",
    },
    Marmita: {
        columns: 1,
        originalTileSize: {
            width: 32,
            height: 32,
        },
        path: "./assets/img/marmita.png",
        type: "image",
        name: "Marmita",
    },
    Carrinho: {
        columns: 1,
        originalTileSize: {
            width: 64,
            height: 64,
        },
        path: "./assets/img/carrinho da marmita.png",
        type: "image",
        name: "Carrinho",
    },
    GoalAsset: {
        columns: 3,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/img/morador de rua.png",
        type: "image",
        name: "GoalAsset",
    },
    CopAsset: {
        columns: 8,
        originalTileSize: {
            width: 32,
            height: 64,
        },
        path: "./assets/img/gcm-Sheet.png",
        type: "image",
        name: "CopAsset",
    },
    TitleScreen: {
        columns: 1,
        originalTileSize: {
            width: 90,
            height: 160,
        },
        path: "./assets/img/titulo.png",
        type: "image",
        name: "TitleScreen",
    },
    Vitoria: {
        columns: 1,
        originalTileSize: {
            width: 90,
            height: 160,
        },
        path: "./assets/img/vitoria.png",
        type: "image",
        name: "Vitoria",
    },
    Derrota: {
        columns: 1,
        originalTileSize: {
            width: 90,
            height: 160,
        },
        path: "./assets/img/derrota.png",
        type: "image",
        name: "Derrota",
    },
};
const gameConfig = {
    aspectRatio: 9 / 16,
    UnitSizeProportion: 0.07,
    fadeInSpeed: 100,
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
    DEFEAT_SCREEN: "defear-screen",
    VICTORY_SCREEN: "victory-screen",
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
    gamePlaying(manager);
    titleScreen(manager);
    defeatScreen(manager);
}
function addAssetsToManager(manager) {
    for (const asset of Object.keys(AssetList)) {
        const { path } = AssetList[asset];
        manager.addAsset(asset, path);
    }
}
function defeatScreen(manager) {
    let fadeIn = 255;
    let fadeOut = 0;
    const defeat = manager.getAsset(AssetList.Derrota.name);
    let interactionCountdown = 30;
    manager.addState(GameStates.DEFEAT_SCREEN, (m) => {
        background(0);
        image(defeat, 0, 0, width, height);
        if (fadeIn > 0) {
            fadeIn -= gameConfig.fadeInSpeed;
            background(0, fadeIn);
        }
        if (fadeOut > 250) {
            manager.state = GameStates.GAME_PLAYING;
            titleScreen(manager);
        }
        if (interactionCountdown-- < 0 &&
            (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed)) {
            fadeOut += gameConfig.fadeInSpeed;
            background(0, fadeOut);
        }
    });
}
function gamePlaying(manager) {
    let fadeIn = 255;
    let fundoSe = manager.getAsset(AssetList.PracaDaSe.name);
    manager.addState(GameStates.GAME_PLAYING, (m) => {
        manager.playAudio("OST");
        image(fundoSe, 0, 0, width, height);
        manager.runEntities();
        if (fadeIn > 0) {
            fadeIn -= gameConfig.fadeInSpeed;
            background(0, fadeIn);
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
        image(logo, 0, 0, m.UnitSize * 3, m.UnitSize * 3);
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
    Goal.create(manager, { x: -width * 0.6, y: height / 4 }, { x: width * 0.8, y: height / 4 }, 3);
    MarmitaDrop.create(manager);
    for (let i = 0; i < Cops.CopCount; i++)
        Cops.create(manager, 1, { min: -manager.UnitSize, max: -manager.UnitSize }, { x: width / 2 - manager.UnitSize / 2, y: height / 2 - manager.UnitSize });
    ScoreTracker.create(manager);
}
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
function victoryScreen(manager) {
    let fadeIn = 255;
    let fadeOut = 0;
    const victory = manager.getAsset(AssetList.Vitoria.name);
    let interactionCountdown = 30;
    manager.addState(GameStates.VICTORY_SCREEN, (m) => {
        background(0);
        image(victory, 0, 0, width, height);
        if (fadeIn > 0) {
            fadeIn -= gameConfig.fadeInSpeed;
            background(0, fadeIn);
        }
        if (fadeOut > 250) {
            manager.state = GameStates.GAME_PLAYING;
            titleScreen(manager);
        }
        if (interactionCountdown-- < 0 &&
            (mouseIsPressed || fadeOut >= gameConfig.fadeInSpeed)) {
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
                pointInRect(x0 + w0 / 2, y0 - h0 / 2, x1, y1, w1, h1));
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
BaseBehaviors.Names = {
    SpriteAnimation: "sprite-animation",
    AddSpriteCycle: "add-sprite-cycle",
    SetCurrentSpriteCycle: "set-sprite-cycle",
    ConstrainToScreen: "constrain-entity-to-screen",
    Shake: "shake-base-behavior",
    TrasitionState: "transition-between-states",
    Spawn: "spawn-base-behavior",
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
    playAudio(audioName, delay = 0) {
        const audio = this.assets.get(audioName);
        audio.setVolume(this.globalVolume);
        if (!audio.isPlaying())
            audio.play(delay);
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