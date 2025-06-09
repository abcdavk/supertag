import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, world } from "@minecraft/server";
world.afterEvents.entityHitEntity.subscribe(({ hitEntity: target, damagingEntity: player }) => {
    if (player.typeId === "minecraft:player") {
        // mojang bug fix
        const equip = player.getComponent(EntityComponentTypes.Equippable);
        const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
        const fixItems = ["supertag:gray_blood_shard", "supertag:blood_shard"];
        if (!equip)
            return;
        if (mainHand && fixItems.includes(mainHand.typeId)) {
            // console.warn("test 2")
            const durability = mainHand.getComponent(ItemComponentTypes.Durability);
            if (durability) {
                durability.damage -= 2;
                equip.setEquipment(EquipmentSlot.Mainhand, mainHand);
            }
        }
    }
});
