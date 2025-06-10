import { EntityComponentTypes, EquipmentSlot, system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { onItemUseTrigger } from "../triggers/onItemUse";
import { getRandomInt } from "../core/utils";
const bloom_treatment = {
    name: "bloom_treatment",
    define_var: {
        cooldown: 20,
        itemIds: [
            "minecraft:red_tulip",
            "minecraft:allium",
            "minecraft:orange_tulip",
            "minecraft:azure_bluet",
            "minecraft:blue_orchid",
            "minecraft:allium",
            "minecraft:blue_orchid",
            "minecraft:dandelion",
            "minecraft:poppy",
            "minecraft:oxeye_daisy",
            "minecraft:pink_tulip",
            "minecraft:white_tulip",
            "minecraft:rose_bush",
            "minecraft:lilac",
            "minecraft:sunflower",
            "minecraft:red_mushroom",
            "minecraft:brown_mushroom",
            "minecraft:spore_blossom",
            "minecraft:lily_of_the_valley",
            "minecraft:cornflower",
            "minecraft:peony"
        ],
        cancelUse: true
    },
    activate(player) {
        system.run(() => {
            const equip = player.getComponent(EntityComponentTypes.Equippable);
            const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
            const duration = getRandomInt(10, 15);
            const amplifier = getRandomInt(0, 2);
            if (!equip || !mainHand)
                return;
            player.addEffect("regeneration", duration * 20, { amplifier: amplifier });
            if (mainHand.amount - 1 > 0) {
                mainHand.amount--;
                equip.setEquipment(EquipmentSlot.Mainhand, mainHand);
            }
            else
                equip.setEquipment(EquipmentSlot.Mainhand, undefined);
        });
    }
};
PowerManager.registerPower(bloom_treatment, [
    onItemUseTrigger
]);
