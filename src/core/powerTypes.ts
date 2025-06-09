import { Player } from "@minecraft/server";

export type Power = {
  name: string;
  define_var?: any;
  begin?(player: Player): void;
  activate?(player: Player): void;
  update?(player: Player, other: { trigger: string, data: any[] }): void;
  end?(player: Player): void;


  itemUse?(player: Player, other: { trigger: string, data: any[] }): void;
}
