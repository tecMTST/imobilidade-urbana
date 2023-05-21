export function throwCustomError(error: Error, message: string): never {
  error.message = message;
  throw error;
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ColorInterface {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export class Helpers {
  static random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static randint(min: number, max: number) {
    return Math.floor(Helpers.random(min, max));
  }

  randElement<T>(list: Array<T>): T {
    return list[Helpers.randint(0, list.length)];
  }
}

export class ERRORS {
  static Entity = {
    NO_BEHAVIOR: new Error("Entity has no behavior of given name."),
  };
}
