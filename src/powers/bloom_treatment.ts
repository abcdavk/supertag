import { EntityComponent, EntityComponentTypes, EntityEquippableComponent, EquipmentSlot, system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { onItemUseTrigger } from "../triggers/onItemUse";
import { getRandomInt } from "../core/utils";

const bloom_treatment: Power = {
  name: "bloom_treatment",
  define_var: {
    cooldown: 20,
    itemIds: ["minecraft:dandelion", "minecraft:poppy", "minecraft:blue_orchid"],
    cancelUse: true
  },
  activate(player) {
    system.run(() => {
      const equip = player.getComponent(EntityComponentTypes.Equippable);
      const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
      const duration = getRandomInt(10, 15);
      const amplifier = getRandomInt(0, 2);
  
      if (!equip || !mainHand) return;
  
  
      player.addEffect("regeneration", duration * 20, { amplifier: amplifier });
      
      if (mainHand.amount - 1 > 0) {
        mainHand.amount--;
        equip.setEquipment(EquipmentSlot.Mainhand, mainHand);
      } else equip.setEquipment(EquipmentSlot.Mainhand, undefined);
    });
  }
};

PowerManager.registerPower(bloom_treatment, [
  onItemUseTrigger
]);