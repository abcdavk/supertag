import { Power } from "./powerTypes";
import { PowerTrigger } from "./triggerTypes";

export class PowerManager {
  private static powers: Power[] = [];

  static registerPower(power: Power, triggers: PowerTrigger[]) {
    if (!/^[a-zA-Z0-9_]+$/.test(power.name)) {
      throw new Error(
        `Invalid power name "${power.name}". Only letters (a-z, A-Z), numbers (0-9), and underscore (_) are allowed.`
      );
    }

    this.powers.push(power);
    for (const trigger of triggers) {
      trigger.register(power);
    }
  }

  static getPower(name: string): Power | undefined {
    return this.powers.find(power => power.name === name);
  }
}
