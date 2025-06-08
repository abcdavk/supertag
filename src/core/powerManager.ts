import { Power } from "./powerTypes";
import { PowerTrigger } from "./triggerTypes";

export class PowerManager {
  private static powers: Power[] = [];

  static registerPower(power: Power, triggers: PowerTrigger[]) {
    this.powers.push(power);
    for (const trigger of triggers) {
      trigger.register(power);
    }
  }
  
  static getPower(name: string): Power | undefined {
    return this.powers.find(power => power.name === name);
  }
}
