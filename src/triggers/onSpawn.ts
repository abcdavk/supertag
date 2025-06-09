import { Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { CooldownManager } from "../core/cooldownManager";

export const onSpawnTrigger: PowerTrigger = {
  name: "onSpawn",
  register(power) {
    try {
      const cooldownManager = new CooldownManager(); 
      const cooldownCount = power.define_var?.cooldown ?? 0;

      world.afterEvents.playerSpawn.subscribe(({ player }) => {
        const onCooldown = cooldownManager.addSupertag(player.nameTag, { id: power.name, cooldown: cooldownCount * 20 });
        if (onCooldown) power.activate?.(player);
      });
      
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  }
};
