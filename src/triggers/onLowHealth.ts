import { EntityComponentTypes, Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";


export const onLowHealthTrigger: PowerTrigger = {
  name: "onLowHealth",
  register(power) {
    try {
      const minHealth = power.define_var.minHealthValue;

      const cooldownManager = new CooldownManager(); 
      const cooldownCount = power.define_var?.cooldown ?? 0;

      world.afterEvents.entityHurt.subscribe((event) => {
        const player = event.hurtEntity as Player;
        const health = player.getComponent(EntityComponentTypes.Health);
        if (
          checkPower(player, power) &&
          player && 
          player.typeId === "minecraft:player" && 
          health &&
          health.currentValue <= minHealth
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
