import { world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { onSpawnTrigger } from "../triggers/onSpawn";
import { onItemUseTrigger } from "../triggers/onItemUse";
const vigor = {
    name: "vigor",
    define_var: {
        cooldown: 10
    },
    activate(player) {
        world.sendMessage(`§b${player.nameTag} lives life!`);
    }
};
PowerManager.registerPower(vigor, [
    onSpawnTrigger,
    onItemUseTrigger
]);
