/// <reference path="../../lib/entity.ts"/>

interface ControllerOptions {
  origin: p5.Vector;
  currentPress: p5.Vector;
  isPressed: boolean;
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

  static create(manager: GameManager) {
    const joystick = new Entity(
      "joystick",
      1,
      { width: manager.UnitSize, height: manager.UnitSize * 2 },
      { x: 0, y: 0 }
    );

    Joystick.controlEvent(manager, joystick);
    Joystick.draw(manager, joystick);

    manager.addEntity(joystick, joystick.layer);
  }

  static draw(manager: GameManager, joystick: Entity) {
    joystick.addListener(
      Joystick.Events.ControlEvent.name,
      (options: ControllerOptions) => {
        const { currentPress } = options;
        if (options.isPressed) {
          fill(255, 90);
          circle(0, 0, manager.UnitSize);
          stroke(255, 0, 0);
          strokeWeight(3);
          const norm = currentPress.copy();
          if (norm.x ** 2 + norm.y ** 2 > manager.UnitSize ** 2)
            norm.normalize().mult(manager.UnitSize);
          line(0, 0, norm.x, norm.y);
        }
      }
    );
  }

  static controlEvent(manager: GameManager, joystick: Entity) {
    joystick.addBehavior(
      Joystick.Behaviors.EmitControlEvent,
      (e) => {
        let options = manager.getEvent(Joystick.Events.ControlEvent.name) as
          | ControllerOptions
          | undefined;

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
      },
      true
    );
  }
}
