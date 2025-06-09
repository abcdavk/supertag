import { EntityComponentTypes, EquipmentSlot, ItemLockMode, ItemStack, world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { alwaysRunTrigger } from "../triggers/alwaysRun";

const fly: Power = {
  name: "fly",
  activate(player) {
    const equip = player.getComponent(EntityComponentTypes.Equippable);
    const chestplateItem = equip?.getEquipment(EquipmentSlot.Chest);
    if (equip && !chestplateItem || chestplateItem?.typeId !== "minecraft:elytra") {
      const elytraItem = new ItemStack("minecraft:elytra");
      elytraItem.lockMode = ItemLockMode.slot;
      elytraItem.keepOnDeath = true;
      equip?.setEquipment(EquipmentSlot.Chest, elytraItem);
    }
  }
};

PowerManager.registerPower(fly, [
  alwaysRunTrigger
]);
