import { system } from "@minecraft/server";
import { PowerManager } from "../core/powerManager";
import { onLowHealthTrigger } from "../triggers/onLowHealth";
const effectList = [
    { type: "speed", duration: 20, amplifier: 4 },
    { type: "strength", duration: 10, amplifier: 2 },
];
const adrenaline_rush = {
    name: "adrenaline_rush",
    define_var: {
        minHealthValue: 10,
        cooldown: 30
    },
    activate(player) {
        player.sendMessage(`§aAdrenaline rush flowing as your blood is dying!`);
        player.runCommandAsync("camerashake add @s 0.1 20");
        for (const effect of effectList) {
            player.addEffect(effect.type, effect.duration * 20, { amplifier: effect.amplifier });
        }
        system.runTimeout(() => {
            player.addEffect("nausea", 10 * 20);
            player.sendMessage(`§eThe side effects are starting to be felt!`);
        }, 15 * 20);
    }
};
PowerManager.registerPower(adrenaline_rush, [
    onLowHealthTrigger
]);
