import { EntityComponentTypes, Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";
import { CooldownManager } from "../core/cooldownManager";


export const onAttackTrigger: PowerTrigger = {
  name: "onAttack",
  register(power) {
    try {
      if (typeof power.update !== "function") {
        throw(`Power "${power.name}" is missing required "update" function.`);
      }

      world.afterEvents.entityDie.subscribe((event) => {
        const player = event.damageSource.damagingEntity as Player;
        const target = event.deadEntity;
        if (
          checkPower(player, power) &&
          player && 
          player.typeId === "minecraft:player"
        ) {
          power.update?.(player, { trigger: this.name, data: [ target ] });
        }
      });
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  }
};
