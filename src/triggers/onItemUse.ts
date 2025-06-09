import { system, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";

export const onItemUseTrigger: PowerTrigger = {
  name: "onItemUse",
  register(power) {
    try {
      const itemIds: string[] = power.define_var?.itemIds;

      if (!Array.isArray(itemIds) || !itemIds.every(id => typeof id === "string")) {
        throw new Error(`Power "${power.name}" is missing required "itemIds" (string[]) in "define_var".`);
      }


      const cooldownManager = new CooldownManager();
      const cooldownCount = power.define_var?.cooldown ?? 0;
      const hideCooldownInfo = power.define_var?.hideCooldownInfo ?? false;
      const cancelUse = power.define_var?.cancelUse ?? false;
      if (cancelUse) {
        world.beforeEvents.itemUseOn.subscribe((event) => {
          const { itemStack, source: player, block } = event;

          if (
            checkPower(player, power) &&
            itemIds.includes(itemStack.typeId)
          ) {
            const onCooldown = cooldownManager.addSupertag(player.nameTag, {
              id: power.name,
              cooldown: cooldownCount * 20,
              hide: hideCooldownInfo
            });

            if (onCooldown) {
              if (typeof power.itemUse === "function") {
                power.itemUse(player, { trigger: this.name, data: [ itemStack, block ] });
              } else {
                power.activate?.(player);
              }
              event.cancel = true;
            }
          }
        });
      } else {
        world.afterEvents.itemUse.subscribe((event) => {
          const { itemStack, source: player } = event;

          if (
            checkPower(player, power) &&
            itemIds.includes(itemStack.typeId)
          ) {
            const onCooldown = cooldownManager.addSupertag(player.nameTag, {
              id: power.name,
              cooldown: cooldownCount * 20,
              hide: hideCooldownInfo
            });

            if (onCooldown) {
              if (typeof power.itemUse === "function") {
                power.itemUse(player, { trigger: this.name, data: [ itemStack ] });
              } else {
                power.activate?.(player);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  },
};
