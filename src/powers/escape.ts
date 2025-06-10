import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemLockMode, ItemStack, system, Vector3, world } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { Power } from "../core/powerTypes";
import { onItemUseTrigger } from "../triggers/onItemUse";
import { onLowHealthTrigger } from "../triggers/onLowHealth";
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
  itemUseOn(player, itemStack, block) {
    system.run(() => {
        const markLoc = block.center();
  
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
    });
  },
  activate(player) {
    const markLoc = player.getDynamicProperty(this.define_var.markedProperty) as Vector3; 
    if (markLoc) {
      player.runCommandAsync("camerashake add @s 0.2 5");
      player.sendMessage(`§bYou escaped from battle!`);

      const loc = player.location;
      player.dimension.spawnParticle("supertag:escape_bolt", {
        x: loc.x,
        y: loc.y + 1,
        z: loc.z
      });
      player.dimension.spawnParticle("supertag:escape_trail", {
        x: loc.x,
        y: loc.y + 0.59,
        z: loc.z + 0.1
      });

      system.runTimeout(() => {
        player.teleport({
          x: markLoc.x,
          y: markLoc.y + 1,
          z: markLoc.z
        });
        player.dimension.spawnParticle("supertag:escape_bolt", {
          x: markLoc.x,
          y: markLoc.y + 1,
          z: markLoc.z
        });
        player.dimension.spawnParticle("supertag:escape_trail", {
          x: markLoc.x,
          y: markLoc.y + 0.59,
          z: markLoc.z + 0.1
        });
      }, 10)

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
