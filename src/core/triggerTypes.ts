import { Power } from "./powerTypes";

export type PowerTrigger = {
  name: string;
  register: (power: Power) => void;
}