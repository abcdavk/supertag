import { system, world } from "@minecraft/server";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";
export const alwaysRunTrigger = {
    name: "alwaysRun",
    register(power) {
        try {
            const cooldownManager = new CooldownManager();
            const cooldownCount = power.define_var?.cooldown ?? 0;
            system.runInterval(() => {
                world.getPlayers().forEach(player => {
                    if (checkPower(player, power)) {
                        const onCooldown = cooldownManager.addSupertag(player.nameTag, { id: power.name, cooldown: cooldownCount * 20, hide: true });
                        if (onCooldown)
                            power.activate(player);
                    }
                });
            });
        }
        catch (error) {
            console.error(`Failed to register ${power.name}. ${error}`);
        }
    },
};
