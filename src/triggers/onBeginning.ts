import { EntityComponentTypes, Player, system, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";
import { checkPower } from "../core/utils";

export const onBeginningTrigger: PowerTrigger = {
  name: "onBeginning",
  register(power) {
    try {

      if (typeof power.begin !== "function") {
        throw(`Power "${power.name}" is missing required "begin" function.`);
      }

      system.runInterval(() => {
        world.getPlayers().forEach(player => {
          if (checkPower(player, power) && !player.hasTag(`supertag-begin:${power.name}`)) {
            player.addTag(`supertag-begin:${power.name}`);
            power.begin?.(player);
          }
        });
      });
    } catch (error) {
      console.error(`Failed to register ${power.name}. ${error}`);
    }
  },
}