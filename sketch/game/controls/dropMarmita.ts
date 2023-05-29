class MarmitaDrop {
  static Behaviors = {
    TapCheck: "tap-check",
  };

  static Events = {
    DropMarmita: "drop-marmita",
  };

  static create(manager: GameManager) {
    const dropper = new Entity("dropper", 0);

    MarmitaDrop.checkTap(manager, dropper);

    manager.addEntity(dropper, dropper.layer);
  }

  static checkTap(manager: GameManager, dropper: Entity) {
    let countDownTimer = 0;
    dropper.addBehavior(
      MarmitaDrop.Behaviors.TapCheck,
      (e) => {
        if (mouseIsPressed) countDownTimer++;
        else {
          if (
            countDownTimer < 5 &&
            countDownTimer !== 0 &&
            Player.MarmitaSettings.isHolding
          ) {
            manager.addEvent(MarmitaDrop.Events.DropMarmita, {});
          }
          countDownTimer = 0;
        }
      },
      true
    );
  }
}
