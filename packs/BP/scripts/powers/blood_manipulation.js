import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemLockMode, ItemStack, system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { onItemUseTrigger } from "../triggers/onItemUse";
import { onBeginningTrigger } from "../triggers/onBeginning";
import { onEndingTrigger } from "../triggers/onEnding";
import { onKillingTrigger } from "../triggers/onKilling";
import { getRandomInt } from "../core/utils";
import { onAttackTrigger } from "../triggers/onAttack";
const blood_manipulation = {
    name: "blood_manipulation",
    define_var: {
        cooldown: 0,
        itemIds: ["supertag:blood_shard", "supertag:gray_blood_shard", "supertag:blood_sword", "supertag:blood_scythe"],
        cancelUse: false,
        hideCooldownInfo: true
    },
    begin(player) {
        const bloodShardItem = new ItemStack("supertag:gray_blood_shard");
        bloodShardItem.lockMode = ItemLockMode.inventory;
        bloodShardItem.keepOnDeath = true;
        const durability = bloodShardItem.getComponent(ItemComponentTypes.Durability);
        if (durability)
            durability.damage = durability.maxDurability - 10;
        player.dimension.spawnItem(bloodShardItem, player.location);
    },
    activate(player) {
        system.run(() => {
            const equip = player.getComponent(EntityComponentTypes.Equippable);
            const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
            const bloodWeapons = [
                "supertag:blood_sword",
                "supertag:blood_scythe"
            ];
            if (!equip)
                return;
            if (!mainHand)
                return;
            if (mainHand.typeId === "supertag:blood_shard") {
                const newBloodWeapon = new ItemStack(bloodWeapons[Math.floor(Math.random() * bloodWeapons.length)]);
                newBloodWeapon.lockMode = ItemLockMode.inventory;
                newBloodWeapon.keepOnDeath = true;
                equip.setEquipment(EquipmentSlot.Mainhand, newBloodWeapon);
            }
        });
    },
    onKilling(player, target) {
        const targetFamily = target.getComponent(EntityComponentTypes.TypeFamily);
        const includesFamilies = ["monster", "player", "animal"];
        const inv = player.getComponent(EntityComponentTypes.Inventory);
        const con = inv?.container;
        includesFamilies.forEach(family => {
            if (targetFamily?.hasTypeFamily(family)) {
                if (inv && con) {
                    for (let i = 0; i < inv.inventorySize; i++) {
                        const itemInv = con.getItem(i);
                        if (itemInv && itemInv.typeId === "supertag:gray_blood_shard") {
                            const durability = itemInv.getComponent(ItemComponentTypes.Durability);
                            if (!durability)
                                return;
                            if (durability?.damage > getRandomInt(0, 30)) {
                                if (durability) {
                                    if (durability.damage - 10 >= 0) {
                                        durability.damage -= 10;
                                    }
                                    else {
                                        durability.damage = 0;
                                    }
                                }
                                con.setItem(i, itemInv);
                            }
                            else {
                                const bloodShardItem = new ItemStack("supertag:blood_shard");
                                bloodShardItem.lockMode = ItemLockMode.inventory;
                                bloodShardItem.keepOnDeath = true;
                                con.setItem(i, bloodShardItem);
                            }
                        }
                    }
                }
            }
        });
    },
    onAttack(player, target) {
        const equip = player.getComponent(EntityComponentTypes.Equippable);
        const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
        const bloodWeapons = [
            "supertag:blood_sword",
            "supertag:blood_scythe"
        ];
        if (!equip || !mainHand)
            return;
        if (!bloodWeapons.includes(mainHand.typeId))
            return;
        const targetLoc = target.location;
        const viewDir = player.getViewDirection();
        player.dimension.spawnParticle("supertag:blood_spray", {
            x: targetLoc.x - viewDir.x,
            y: targetLoc.y + 1,
            z: targetLoc.z - viewDir.z
        });
        const bloodDur = mainHand.getComponent(ItemComponentTypes.Durability);
        if (!bloodDur)
            return;
        if (bloodDur.damage >= bloodDur.maxDurability - 5) {
            const newBloodShard = new ItemStack("supertag:gray_blood_shard");
            newBloodShard.lockMode = ItemLockMode.inventory;
            newBloodShard.keepOnDeath = true;
            const newShardDur = newBloodShard.getComponent(ItemComponentTypes.Durability);
            if (newShardDur) {
                newShardDur.damage = newShardDur.maxDurability - getRandomInt(10, 30);
            }
            equip.setEquipment(EquipmentSlot.Mainhand, newBloodShard);
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
PowerManager.registerPower(blood_manipulation, [
    onItemUseTrigger,
    onBeginningTrigger,
    onEndingTrigger,
    onKillingTrigger,
    onAttackTrigger
]);
