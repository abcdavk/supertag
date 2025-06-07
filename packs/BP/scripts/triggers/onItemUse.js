import { world } from "@minecraft/server";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";
export const onItemUseTrigger = {
    name: "onItemUse",
    register(power) {
        const cooldownManager = new CooldownManager();
        const cooldownCount = power.define_var?.cooldown ?? 0;
        world.afterEvents.itemUse.subscribe(({ itemStack, source: player }) => {
            if (checkPower(player, power) &&
                itemStack.typeId === "minecraft:stick") {
                console.warn(JSON.stringify(cooldownManager.getWorldCooldownData()));
                console.info(power.name);
                const onCooldown = cooldownManager.addSupertag(player.nameTag, { id: power.name, cooldown: cooldownCount });
                if (onCooldown)
                    power.activate(player);
                else
                    console.info("on cooldown");
            }
        });
    }
};
