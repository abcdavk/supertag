export class PowerManager {
    static registerPower(power, triggers) {
        this.powers.push(power);
        for (const trigger of triggers) {
            trigger.register(power);
        }
    }
    static getPower(name) {
        return this.powers.find(power => power.name === name);
    }
}
PowerManager.powers = [];
