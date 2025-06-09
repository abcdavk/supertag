import { world } from "@minecraft/server";
import { PowerManager } from "./core/powerManager";
import { CooldownManager } from "./core/cooldownManager";

import "./powers/main"; 
import "./fixItems";

world.afterEvents.worldInitialize.subscribe(() => {
  if (!world.getDynamicProperty("supertag:cooldown")) {
    console.log(`Initialize Supertag`);
    world.setDynamicProperty("supertag:cooldown", JSON.stringify([]));
  } else {
    console.log(`Supertag enabled`);
  }
  // new CooldownManager().saveWorldCooldownData([]);
});

world.afterEvents.playerSpawn.subscribe(({ player }) => {
  const isInit = new CooldownManager().init(player.nameTag);
  if (isInit) {
    console.log(`Initialize ${player.nameTag}...`);
  } else {
    console.log(`${player.nameTag} join the game`)
  }
});
