import { world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { onSpawnTrigger } from "../triggers/onSpawn";
import { onItemUseTrigger } from "../triggers/onItemUse";

const vigor: Power = {
  name: "vigor",
  define_var: {
    cooldown: 10
  },
  activate(player) {
    world.sendMessage(`§b${player.nameTag} lives life!`);
  }
};

PowerManager.registerPower(vigor, [
  onSpawnTrigger,
  onItemUseTrigger
]);
