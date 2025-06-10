import { world } from "@minecraft/server";
import { checkPower } from "../core/utils";
export const onAttackTrigger = {
    name: "onAttack",
    register(power) {
        try {
            if (typeof power.onAttack !== "function") {
                throw (`Power "${power.name}" is missing required "onAttack" function.`);
            }
            world.afterEvents.entityHitEntity.subscribe((event) => {
                const player = event.damagingEntity;
                const target = event.hitEntity;
                if (checkPower(player, power) &&
                    player &&
                    player.typeId === "minecraft:player") {
                    power.onAttack?.(player, target);
                }
            });
        }
        catch (error) {
            console.error(`Failed to register ${power.name}. ${error}`);
        }
    }
};
