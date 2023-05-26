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

  static randSign() {
    return Math.sign(Math.random() - 0.5);
  }

  static randElement<T>(list: Array<T>): T {
    return list[Helpers.randint(0, list.length)];
  }

  static randVector(): p5.Vector {
    return createVector(Math.random() - 0.5, Math.random() - 0.5).normalize();
  }
}

class ERRORS {
  static Entity = {
    NO_BEHAVIOR: new Error("Entity has no behavior of given name."),
  };
}
