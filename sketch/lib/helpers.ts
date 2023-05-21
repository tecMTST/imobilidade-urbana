function throwCustomError(error: Error, message: string): never {
  error.message = message;
  throw error;
}

interface Size {
  width: number;
  height: number;
}

interface PositionCoordinates {
  x: number;
  y: number;
}

interface ColorInterface {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

class Helpers {
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

class ERRORS {
  static Entity = {
    NO_BEHAVIOR: new Error("Entity has no behavior of given name."),
  };
}
