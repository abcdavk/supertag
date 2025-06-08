import { world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { alwaysRunTrigger } from "../triggers/alwaysRun";
import { infinity } from "../core/utils";
const night_sight = {
    name: "night_sight",
    activate(player) {
        const timeOfDay = world.getTimeOfDay();
        if (timeOfDay > 12000 && timeOfDay < 23000) {
            player.addEffect("night_vision", infinity, { showParticles: false });
        }
        else {
            player.removeEffect("night_vision");
        }
    }
};
PowerManager.registerPower(night_sight, [
    alwaysRunTrigger
]);
