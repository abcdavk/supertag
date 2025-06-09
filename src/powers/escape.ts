import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemLockMode, ItemStack, system, Vector3, world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { onItemUseTrigger } from "../triggers/onItemUse";
import { onLowHealthTrigger } from "../triggers/onLowHealth";
import { PowerTriggerName } from "../triggers/enum";
import { formatID } from "../core/utils";
import { onBeginningTrigger } from "../triggers/onBeginning";
import { onEndingTrigger } from "../triggers/onEnding";

const escape: Power = {
  name: "escape",
  define_var: {
    minHealthValue: 6,
    itemIds: ["supertag:escape_mark", "supertag:active_escape_mark"],
    cooldown: 30,
    markedProperty: "escape:marked_location",
    cancelUse: true
  },
  begin(player) {
    const newEscapeMark = new ItemStack("supertag:escape_mark");
      newEscapeMark.lockMode = ItemLockMode.inventory;
      newEscapeMark.keepOnDeath = true;
    
    player.dimension.spawnItem(newEscapeMark, player.location);
  },
  itemUse(player, other) {
    system.run(() => {
      if (other.trigger === PowerTriggerName.OnItemUse) {
        const [ itemStack, block ] = other.data;
        const markLoc = block.location;
  
        const equip = player.getComponent(EntityComponentTypes.Equippable);
  
        if (itemStack.typeId === "supertag:escape_mark") {
          const newEscapeMark = new ItemStack("supertag:active_escape_mark");
            newEscapeMark.lockMode = ItemLockMode.inventory;
            newEscapeMark.keepOnDeath = true;

          player.setDynamicProperty(this.define_var.markedProperty, markLoc);
          equip?.setEquipment(EquipmentSlot.Mainhand, newEscapeMark);
          player.sendMessage(`§bYou leave a mark on ${formatID(block.typeId)}!`);
        } else {
          const newEscapeMark = new ItemStack("supertag:escape_mark");
            newEscapeMark.lockMode = ItemLockMode.inventory;
            newEscapeMark.keepOnDeath = true;

          player.setDynamicProperty(this.define_var.markedProperty, undefined);
          equip?.setEquipment(EquipmentSlot.Mainhand, newEscapeMark);
          player.sendMessage(`§eEscape marks removed!`);
        }
      }
    });
  },
  activate(player) {
    const markLoc = player.getDynamicProperty(this.define_var.markedProperty) as Vector3; 
    if (markLoc) {
      player.teleport(markLoc);
      player.runCommandAsync("camerashake add @s 0.2 5");
      player.sendMessage(`§bYou escaped from battle!`);

      // player.setDynamicProperty(this.define_var.markedProperty, undefined);
      
      // const inv = player.getComponent(EntityComponentTypes.Inventory);
      // const con = inv?.container;
      // if (inv && con) {
      //   for (let i = 0; i < inv.inventorySize; i++) {
      //     const itemInv = con.getItem(i);
      //     if (itemInv && this.define_var.itemIds.includes(itemInv.typeId)) {
      //       const newEscapeMark = new ItemStack("supertag:escape_mark");
      //         newEscapeMark.lockMode = ItemLockMode.inventory;
      //         newEscapeMark.keepOnDeath = true;
      //       con.setItem(i, newEscapeMark);
      //     }
      //   }
      // }
    } else {
      player.sendMessage(`§eBeware, there are no escape marks!`);
    }
  },
  end(player) {
    const inv = player.getComponent(EntityComponentTypes.Inventory);
    const con = inv?.container;
    if (inv && con) {
      for (let i = 0; i < inv.inventorySize; i++) {
        const itemInv = con.getItem(i);
        if (itemInv && this.define_var.itemIds.includes(itemInv.typeId)) {
          con.setItem(i, undefined);
        }
      }
    }
  },
};

PowerManager.registerPower(escape, [
  onItemUseTrigger,
  onLowHealthTrigger,
  onBeginningTrigger,
  onEndingTrigger
]);
