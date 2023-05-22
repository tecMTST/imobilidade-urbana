type AnimationCycleName = string;

type SpriteIndex = number;
interface SpriteAnimationCycle {
  cycle: SpriteIndex[];
  timeBetweenFrames: number;
}

interface SpriteAnimationIdentifier {
  name: string;
  idx: SpriteIndex;
  timeSinceFrame: number;
}

interface NewCycleInformation {
  cycleName: AnimationCycleName;
  frames: SpriteIndex[];
  timing: number;
}

class SpriteAnimation {
  private current: SpriteAnimationIdentifier;
  private animationCycles: Map<AnimationCycleName, SpriteAnimationCycle>;
  readonly tileset: Tileset;

  static ERROR = {
    NoCycle: new Error("Animation Cycle doesn't exist."),
  };

  constructor(tileset: Tileset) {
    this.tileset = tileset;
    this.animationCycles = new Map();
    this.current = {
      name: "default",
      idx: 0,
      timeSinceFrame: 0,
    };
  }

  addCycle(cycle: NewCycleInformation) {
    const { cycleName, frames, timing } = cycle;
    this.animationCycles.set(cycleName, {
      cycle: frames,
      timeBetweenFrames: timing,
    });
  }

  setCurrentAnimation(name: string) {
    this.current = {
      name,
      idx: 0,
      timeSinceFrame: 0,
    };
  }

  draw(
    position: PositionCoordinates,
    rotation: number,
    size: Size,
    opacity = 255
  ) {
    const animationFrames = this.animationCycles.get(this.current.name)?.cycle;

    if (animationFrames === undefined) {
      throwCustomError(
        SpriteAnimation.ERROR.NoCycle,
        `Animation cycle called [${this.current.name}] doesn't exist in cycles Map.`
      );
    }

    const currentSprite = animationFrames[this.current.idx];

    if (animationFrames.length > 1) {
      if (this.current.timeSinceFrame < 0) {
        const currentCycle = this.animationCycles.get(this.current.name);
        if (currentCycle === undefined)
          throwCustomError(
            SpriteAnimation.ERROR.NoCycle,
            `Cycle with name ${this.current.name} does not exist.`
          );
        this.current.timeSinceFrame = currentCycle.timeBetweenFrames;
        this.current.idx = (this.current.idx + 1) % animationFrames.length;
      }
      this.current.timeSinceFrame--;
    }

    push();
    // tint(255, opacity);
    translate(position.x, position.y);
    rotate(rotation);
    this.tileset.drawTile(currentSprite, { x: 0, y: 0 }, size);
    pop();
  }
}
