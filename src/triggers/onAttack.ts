import { EntityComponentTypes, Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";


export const onAttackTrigger: PowerTrigger = {
  name: "onAttack",
  register(power) {
    try {
      if (typeof power.onAttack !== "function") {
        throw(`Power "${power.name}" is missing required "onAttack" function.`);
      }

      world.afterEvents.entityHitEntity.subscribe((event) => {
        const player = event.damagingEntity as Player;
        const target = event.hitEntity;
        if (
          checkPower(player, power) &&
          player && 
          player.typeId === "minecraft:player"
        ) {
          power.onAttack?.(player, target);
        }
      });
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  }
};
