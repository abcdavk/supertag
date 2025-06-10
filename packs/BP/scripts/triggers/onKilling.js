import { world } from "@minecraft/server";
import { checkPower } from "../core/utils";
export const onKillingTrigger = {
    name: "onKilling",
    register(power) {
        try {
            if (typeof power.onKilling !== "function") {
                throw (`Power "${power.name}" is missing required "onKilling" function.`);
            }
            world.afterEvents.entityDie.subscribe((event) => {
                const player = event.damageSource.damagingEntity;
                const target = event.deadEntity;
                if (checkPower(player, power) &&
                    player &&
                    player.typeId === "minecraft:player") {
                    power.onKilling?.(player, target);
                }
            });
        }
        catch (error) {
            console.error(`Failed to register ${power.name}. ${error}`);
        }
    }
};
