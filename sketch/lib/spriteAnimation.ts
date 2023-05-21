import { throwCustomError, Size, Position, ColorInterface } from "./helpers";
import { Tileset } from "./tileset";

export type AnimationCycleName = string;

export type SpriteIndex = number;
export interface SpriteAnimationCycle {
  cycle: SpriteIndex[];
  timeBetweenFrames: number;
}

export interface SpriteAnimationIdentifier {
  name: string;
  idx: SpriteIndex;
  timeSinceFrame: number;
}

export interface NewCycleInformation {
  cycleName: AnimationCycleName;
  frames: SpriteIndex[];
  timing: number;
}

export class SpriteAnimation {
  private current: SpriteAnimationIdentifier;
  private animationCycles: Map<AnimationCycleName, SpriteAnimationCycle>;
  readonly tileset: Tileset;

  static ERROR = {
    NoCycle: new Error("Animation Cycle doesn't exist."),
  };

  constructor(tileset: Tileset) {
    this.tileset = tileset;
    this.animationCycles = new Map();
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

  draw(position: Position, rotation: number, size: Size, opacity = 255) {
    const animationFrames = this.animationCycles.get(this.current.name)?.cycle;

    if (animationFrames === undefined) {
      throwCustomError(
        SpriteAnimation.ERROR.NoCycle,
        `Animation cycle called [${this.current.name}] doesn't exist in cycles Ma`
      );
    }

    const currentSprite = animationFrames[this.current.idx];

    if (animationFrames.length > 1) {
      if (this.current.timeSinceFrame <= 0) {
        this.current.timeSinceFrame = this.animationCycles.get(
          this.current.name
        ).timeBetweenFrames;
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
