import { system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { onItemUseTrigger } from "../triggers/onItemUse";

const coin_flipper: Power = {
  name: "coin_flipper",
  define_var: {
    itemIds: [ "supertag:coin" ],
    cooldown: 2
  },
  activate(player) {
    system.run(() => {
      const randomFlip = Math.floor(Math.random() * 2);
      const dimension = player.dimension;
      if (randomFlip === 0) {
        // Luck side | 777
        dimension.spawnParticle("supertag:coin_flip_luck", player.location);
        player.addEffect("regeneration", 5 * 20, { amplifier: 255, showParticles: false });
      } else {
        // Bad luck side | Crow
        dimension.spawnParticle("supertag:coin_flip_bad_luck", player.location);
        player.addEffect("wither", 10 * 20);
      }
    });
  },
}

PowerManager.registerPower(coin_flipper, [
  onItemUseTrigger
]);