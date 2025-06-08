import { system, world } from "@minecraft/server";
import { generateRandomID } from "./utils";
import { PowerManager } from "./powerManager";
system.runInterval(() => {
    const cooldownManager = new CooldownManager();
    const allData = cooldownManager.getWorldCooldownData();
    for (const playerData of allData) {
        const updatedSupertags = [];
        for (const supertag of playerData.supertags) {
            const hide = supertag.hide ?? false;
            supertag.cooldown -= 1;
            if (supertag.cooldown >= 0) {
                updatedSupertags.push(supertag);
                if (!hide) {
                    try {
                        const power = PowerManager.getPower(supertag.id);
                        const fullCooldown = power?.define_var?.cooldown * 20;
                        if (typeof fullCooldown === "number" && fullCooldown > 0) {
                            const percentage = supertag.cooldown / fullCooldown;
                            const animationValue = Math.floor(percentage * 99);
                            const displayValue = animationValue.toString().padStart(3, "0");
                            const player = world.getPlayers({ name: playerData.nametag })[0];
                            if (player) {
                                player.onScreenDisplay.setTitle(`CD:${displayValue};ST:${supertag.id}`);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`Failed to display cooldown animation of ${supertag.id}. ${error}`);
                    }
                }
            }
        }
        playerData.supertags = updatedSupertags;
    }
    cooldownManager['saveWorldCooldownData'](allData);
});
export class CooldownManager {
    constructor() {
        this.cooldownProperty = "supertag:cooldown";
    }
    getWorldCooldownData() {
        const rawData = world.getDynamicProperty(this.cooldownProperty);
        return JSON.parse(rawData);
    }
    saveWorldCooldownData(data) {
        world.setDynamicProperty(this.cooldownProperty, JSON.stringify(data));
    }
    init(playerName) {
        const newId = generateRandomID();
        const worldCooldownData = this.getWorldCooldownData();
        const alreadyExists = worldCooldownData.some(data => data.nametag === playerName);
        if (alreadyExists)
            return false;
        worldCooldownData.push({
            id: newId,
            nametag: playerName,
            supertags: []
        });
        this.saveWorldCooldownData(worldCooldownData);
        return true;
    }
    getByPlayerName(playerName) {
        const cooldownData = this.getWorldCooldownData().find(data => data.nametag === playerName);
        return cooldownData;
    }
    getSupertagCooldown(playerName, supertagId) {
        const cooldownData = this.getByPlayerName(playerName);
        const supertag = cooldownData?.supertags.filter(supertag => supertag.id === supertagId);
        return supertag?.[0];
    }
    addSupertag(playerName, newSupertag) {
        const worldCooldownData = this.getWorldCooldownData();
        const playerData = worldCooldownData.find(data => data.nametag === playerName);
        if (!playerData)
            return false;
        const exists = playerData.supertags.some(tag => (tag.id === newSupertag.id));
        if (exists)
            return false;
        playerData.supertags.push(newSupertag);
        this.saveWorldCooldownData(worldCooldownData);
        return true;
    }
    remove(playerName) {
        let worldCooldownData = this.getWorldCooldownData();
        const playerData = this.getByPlayerName(playerName);
        if (!playerData)
            return;
        worldCooldownData = worldCooldownData.filter(d => {
            return !(d.nametag === playerName && d.id === playerData.id);
        });
        this.saveWorldCooldownData(worldCooldownData);
        return worldCooldownData;
    }
    removeSupertag(playerName, supertagId) {
        const worldCooldownData = this.getWorldCooldownData();
        const playerData = worldCooldownData.find(data => data.nametag === playerName);
        if (!playerData)
            return false;
        const originalLength = playerData.supertags.length;
        playerData.supertags = playerData.supertags.filter(tag => tag.id !== supertagId);
        if (playerData.supertags.length === originalLength)
            return false;
        this.saveWorldCooldownData(worldCooldownData);
        return true;
    }
}
