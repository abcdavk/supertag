import { PowerManager } from "../core/powerManager";
import { onSpawnTrigger } from "../triggers/onSpawn";
const vigor = {
    name: "vigor",
    define_var: {
        cooldown: 30
    },
    activate(player) {
        player.addEffect("haste", 25 * 20, { amplifier: 0, showParticles: false });
        player.addEffect("strength", 25 * 20, { amplifier: 0, showParticles: false });
    }
};
PowerManager.registerPower(vigor, [
    onSpawnTrigger
]);
