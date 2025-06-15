import { system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { onItemUseTrigger } from "../triggers/onItemUse";
const coin_flipper = {
    name: "coin_flipper",
    define_var: {
        itemIds: ["supertag:coin"],
        cooldown: 2
    },
    activate(player) {
        system.run(() => {
            const randomFlip = Math.floor(Math.random() * 2);
            if (randomFlip === 0) {
                console.warn("Luck side");
            }
            else {
                console.warn("Bad Luck side");
            }
        });
    },
};
PowerManager.registerPower(coin_flipper, [
    onItemUseTrigger
]);
