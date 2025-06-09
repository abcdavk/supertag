export class PowerManager {
    static registerPower(power, triggers) {
        if (!/^[a-zA-Z0-9_]+$/.test(power.name)) {
            throw new Error(`Invalid power name "${power.name}". Only letters (a-z, A-Z), numbers (0-9), and underscore (_) are allowed.`);
        }
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
