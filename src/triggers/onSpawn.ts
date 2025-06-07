import { Player, world } from "@minecraft/server";
import { PowerTrigger } from "../core/triggerTypes";

export const onSpawnTrigger: PowerTrigger = {
  name: "onSpawn",
  register(power) {
    world.afterEvents.playerSpawn.subscribe(({ player }) => {
      power.activate(player);
    });
  }
};
