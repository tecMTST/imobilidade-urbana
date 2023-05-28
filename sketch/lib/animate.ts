interface BaseTweenFunctionArgs {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
  f?: number;
}
type BaseTweenFunction = (x: number, args: BaseTweenFunctionArgs) => number;
type TweenAnimationFuncConfig = {
  func: BaseTweenFunction;
  funcArgs: BaseTweenFunctionArgs;
};
type TweenAnimationParameters = {
  entity: Entity | GameManager;
  currentFrame: number;
  animationConfig: TweenAnimationFuncConfig;
  options: string[];
};

class Animate {
  static getAnimation(
    animation: (params: TweenAnimationParameters) => void,
    animationConfig: TweenAnimationFuncConfig,
    options: string[] = []
  ) {
    let currentFrame = 0;

    return {
      apply: (entity: any) => {
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

  static sine(x: number, args: BaseTweenFunctionArgs) {
    const { a, b, c, d } = args;
    return a * Math.sin(b * x + c) + d;
  }

  static linear(x: number, args: BaseTweenFunctionArgs) {
    return x * args.a + args.b;
  }

  static quadratic(x: number, args: BaseTweenFunctionArgs) {
    const { a, b, c } = args;
    return a * x * x + b * x + c;
  }

  static turn(entityAnimation: TweenAnimationParameters) {
    const { func, funcArgs } = entityAnimation.animationConfig;
    const { entity, currentFrame } = entityAnimation;

    entity.rotation = func(currentFrame, funcArgs);
  }

  static stretch(entityAnimation: TweenAnimationParameters) {
    const { func, funcArgs } = entityAnimation.animationConfig;
    const { entity, currentFrame, options } = entityAnimation;

    for (const side of options) {
      //@ts-ignore
      entity.size[side] = func(currentFrame, funcArgs);
    }
  }

  static move(entityAnimation: TweenAnimationParameters) {
    const { func, funcArgs } = entityAnimation.animationConfig;
    const { entity, currentFrame, options } = entityAnimation;

    for (const direction of options) {
      //@ts-ignore
      entity.position[direction] = func(currentFrame, funcArgs);
    }
  }
}
