import { Player } from "@minecraft/server";

export type Power = {
  name: string;
  define_var?: any;
  activate(player: Player): void;
}
