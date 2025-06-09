import { EntityComponentTypes, EquipmentSlot, ItemLockMode, ItemStack, world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { alwaysRunTrigger } from "../triggers/alwaysRun";

const immortality: Power = {
  name: "immortality",
  activate(player) {
    const equip = player.getComponent(EntityComponentTypes.Equippable);
    const offhand = equip?.getEquipment(EquipmentSlot.Offhand);
    if (equip && !offhand || offhand?.typeId !== "minecraft:totem_of_undying") {
      const totemItem = new ItemStack("minecraft:totem_of_undying");
      totemItem.lockMode = ItemLockMode.slot;
      totemItem.keepOnDeath = true;
      equip?.setEquipment(EquipmentSlot.Offhand, totemItem);
    }
  }
};

PowerManager.registerPower(immortality, [
  alwaysRunTrigger
]);
