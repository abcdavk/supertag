import { EntityComponentTypes, Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";


export const onLowHealthTrigger: PowerTrigger = {
  name: "onLowHealth",
  register(power) {
    const minHealth = power.define_var?.minHealthValue ?? 5;
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
        power.activate(player);
      }
    });
  }
};
