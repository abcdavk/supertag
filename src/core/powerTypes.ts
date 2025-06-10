import { Block, Entity, ItemStack, Player } from "@minecraft/server";

export type Power = {
  name: string;
  define_var?: any;
  begin?(player: Player): void;
  activate?(player: Player): void;
  end?(player: Player): void;

  onAttack?(player: Player, target: Entity): void;
  onKilling?(player: Player, target: Entity): void;
  itemUse?(player: Player, itemStack: ItemStack): void;
  itemUseOn?(player: Player, itemStack: ItemStack, block: Block): void;
}
