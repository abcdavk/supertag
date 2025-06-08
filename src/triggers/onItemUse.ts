import { world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";

export const onItemUseTrigger: PowerTrigger = {
  name: "onItemUse",
  register(power) {
    try {
      const cooldownManager = new CooldownManager(); 
      const cooldownCount = power.define_var?.cooldown ?? 0;
  
      world.afterEvents.itemUse.subscribe(({ itemStack, source: player }) => {
        if (
          checkPower(player, power) && 
          itemStack.typeId === "minecraft:stick"
        ) {
          const onCooldown = cooldownManager.addSupertag(player.nameTag, { id: power.name, cooldown: cooldownCount * 20 });
          if (onCooldown) power.activate(player);
        }
      });
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  }
};
