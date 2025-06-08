import { world } from "@minecraft/server";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";
export const onItemUseTrigger = {
    name: "onItemUse",
    register(power) {
        try {
            const cooldownManager = new CooldownManager();
            const cooldownCount = power.define_var?.cooldown ?? 0;
            const itemIds = power.define_var?.itemIds;
            const cancelUse = power.define_var?.cancelUse ?? false;
            if (cancelUse) {
                world.beforeEvents.itemUseOn.subscribe((event) => {
                    const { itemStack, source: player } = event;
                    if (checkPower(player, power) &&
                        itemIds.includes(itemStack.typeId)) {
                        const onCooldown = cooldownManager.addSupertag(player.nameTag, {
                            id: power.name,
                            cooldown: cooldownCount * 20,
                        });
                        if (onCooldown) {
                            power.activate(player);
                            event.cancel = true;
                        }
                    }
                });
            }
            else {
                world.afterEvents.itemUse.subscribe((event) => {
                    const { itemStack, source: player } = event;
                    if (checkPower(player, power) &&
                        itemIds.includes(itemStack.typeId)) {
                        const onCooldown = cooldownManager.addSupertag(player.nameTag, {
                            id: power.name,
                            cooldown: cooldownCount * 20,
                        });
                        if (onCooldown) {
                            power.activate(player);
                        }
                    }
                });
            }
        }
        catch (error) {
            console.error(`Failed to register ${power.name}. ${error}`);
        }
    },
};
