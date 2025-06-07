import { world } from "@minecraft/server";
export const onSpawnTrigger = {
    name: "onSpawn",
    register(power) {
        world.afterEvents.playerSpawn.subscribe(({ player }) => {
            power.activate(player);
        });
    }
};
