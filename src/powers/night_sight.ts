import { EntityComponentTypes, EquipmentSlot, ItemLockMode, ItemStack, world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { alwaysRunTrigger } from "../triggers/alwaysRun";
import { infinity } from "../core/utils";

const night_sight: Power = {
  name: "night_sight",
  activate(player) {
    const timeOfDay = world.getTimeOfDay();
    if (timeOfDay > 12000 && timeOfDay < 23000) {
      if (!player.hasTag("supertag-once:night_sight")) {
        const viewDir = player.getViewDirection();
        const loc = player.location;
        player.dimension.spawnParticle("supertag:night_eye", {
          x: loc.x + viewDir.x * 1.2,
          y: loc.y + viewDir.y + 2,
          z: loc.z + viewDir.z * 1.2
        })

        player.addEffect("night_vision", infinity, { showParticles: false });
        player.addTag("supertag-once:night_sight");
      }
    } else {
      if (player.hasTag("supertag-once:night_sight")) {
        player.removeTag("supertag-once:night_sight");
        player.removeEffect("night_vision");
      }
    }
  }
};

PowerManager.registerPower(night_sight, [
  alwaysRunTrigger
]);
