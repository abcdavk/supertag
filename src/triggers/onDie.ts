// import { EntityComponentTypes, Player, system, world } from "@minecraft/server";
// import { PowerTrigger } from "../core/triggerTypes";
// import { checkPower } from "../core/utils";

// export const onDieTrigger: PowerTrigger = {
//   name: "onDie",
//   register(power) {
//     system.runInterval(() => {
//       world.getPlayers().forEach(player => {
//         const health = player.getComponent(EntityComponentTypes.Health);
//         if (
//           checkPower(player, power) &&
//           player.typeId === "minecraft:player" &&
//           health &&
//           health.currentValue <= 5
//         ) {
//           power.activate(player);
//         }
//       });
//     });
//   },
// }