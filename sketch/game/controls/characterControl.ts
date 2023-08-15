/// <reference path="../../lib/entity.ts"/>

interface ControllerOptions {
  origin: p5.Vector;
  currentPress: p5.Vector;
  isPressed: boolean;
  isRight: boolean;
  isLeft: boolean;
}

class CharacterControl extends EntityFactory {
  static Behaviors: { [key: string]: string } = {
    EmitControlEvent: "emit-control-event",
  };

  static Events: { [key: string]: any } = {
    ControlEvent: { name: "control-event", options: {} },
  };

  static create(manager: GameManager) {
    const controller = new Entity("controller", 0);
    CharacterControl.emitControlEvent(manager, controller);
    CharacterControl.listenToEvent(manager, controller);

    manager.addEntity(controller, controller.layer);
  }

  static listenToEvent(manager: GameManager, controller: Entity) {
    const widLimit = (manager.size.width / 2) * 0.9;
    controller.addListener(
      CharacterControl.Events.ControlEvent.name,
      (e: ControllerOptions) => {
        const { origin, isPressed, isLeft, isRight } = e;
        fill(200, 0, 0, 90);
        noStroke();
        if (isPressed)
          if (isLeft)
            rect(
              -manager.size.width / 2,
              -manager.size.height / 2,
              manager.size.width / 2 - widLimit,
              manager.size.height
            );
        if (isRight)
          rect(
            widLimit,
            -manager.size.height / 2,
            manager.UnitSize * 2,
            manager.size.height
          );
      }
    );
  }

  static emitControlEvent(manager: GameManager, controller: Entity) {
    const widLimit = (manager.size.width / 2) * 0.9;
    controller.addBehavior(
      CharacterControl.Behaviors.EmitControlEvent,
      (e) => {
        let options = manager.getEvent(
          CharacterControl.Events.ControlEvent.name
        )?.options as ControllerOptions | undefined;

        if (options === undefined) {
          options = {
            origin: createVector(0, 0),
            isPressed: false,
            currentPress: createVector(0, 0),
            isLeft: false,
            isRight: false,
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
        }
        if (options.origin.x < -widLimit && mouseIsPressed)
          options.isLeft = true;
        else options.isLeft = false;
        if (options.origin.x > widLimit && mouseIsPressed)
          options.isRight = true;
        else options.isRight = false;

        manager.addEvent(
          CharacterControl.Events.ControlEvent.name,
          options,
          true
        );
      },
      true
    );
  }
}
