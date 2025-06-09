import { system, world } from "@minecraft/server";
import { checkPower } from "../core/utils";
export const onEndingTrigger = {
    name: "onEnding",
    register(power) {
        try {
            if (typeof power.end !== "function") {
                throw (`Power "${power.name}" is missing required "end" function.`);
            }
            system.runInterval(() => {
                world.getPlayers().forEach(player => {
                    if (!checkPower(player, power) && player.hasTag(`supertag-begin:${power.name}`)) {
                        player.removeTag(`supertag-begin:${power.name}`);
                        power.end?.(player);
                    }
                });
            });
        }
        catch (error) {
            console.error(`Failed to register ${power.name}. ${error}`);
        }
    },
};
