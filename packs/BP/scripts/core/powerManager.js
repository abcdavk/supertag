export class PowerManager {
    static registerPower(power, triggers) {
        this.powers.push(power);
        for (const trigger of triggers) {
            trigger.register(power);
        }
    }
}
PowerManager.powers = [];
