import { EnchantmentType, Player } from "@minecraft/server";
import { Power } from "./powerTypes";

export const infinity = 20000000;

export function checkPower(player: Player, power: Power): boolean {
  if (player && player.typeId === "minecraft:player") {
    const allTags = player.getTags();
    return allTags.some(tag => tag === `supertag:${power.name}`);
  }
  return false;
}

export function generateRandomID(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function formatID(itemtype: string): string {
  const rawName = itemtype.split(":")[1] || itemtype;

  return rawName
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


/**
 * Damages a players held item taking into account unbreaking
 * and destroying the item if it has no durability left.
 *
 * @param player
 */
export function damagePlayersHeldItem(player: Player) {
  const inventoryComponent = player.getComponent("minecraft:inventory");
  if (!inventoryComponent || !inventoryComponent.isValid()) return;
  const container = inventoryComponent.container;
  if (!container || !container.isValid()) return;
  const heldItem = container.getItem(player.selectedSlotIndex);
  if (!heldItem) return;
  const durabilityComponent = heldItem.getComponent("durability");
  if (!durabilityComponent || !durabilityComponent.isValid()) return;
  // Item can be damaged

  const enchantableComponent = heldItem.getComponent("enchantable");
  if (enchantableComponent && enchantableComponent.isValid()) {
    const unbreakingEnchantment = enchantableComponent.getEnchantment(
      new EnchantmentType("unbreaking")
    );
    if (unbreakingEnchantment) {
      if (Math.random() < 1 / (unbreakingEnchantment.level + 1)) return; // lucky, no damage
    }
  }

  durabilityComponent.damage += 1;
  if (durabilityComponent.damage >= durabilityComponent.maxDurability) {
    container.setItem(player.selectedSlotIndex, undefined);
    player.playSound("random.break");
  } else {
    container.setItem(player.selectedSlotIndex, heldItem);
  }
}