export type CooldownType = {
  id: string;
  nametag: string;
  supertags: SupertagCooldownType[];
}

export type SupertagCooldownType = {
  id: string;
  cooldown: number;
  hide?: boolean
}