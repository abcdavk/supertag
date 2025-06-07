import { system, world } from "@minecraft/server";
import { generateRandomID } from "./utils";
system.runInterval(() => {
    const cooldownManager = new CooldownManager();
    const allData = cooldownManager.getWorldCooldownData();
    for (const playerData of allData) {
        const updatedSupertags = [];
        for (const supertag of playerData.supertags) {
            supertag.cooldown -= 1;
            if (supertag.cooldown >= 0) {
                updatedSupertags.push(supertag);
                world.sendMessage(`${playerData.nametag} - ${supertag.id} [${supertag.cooldown}]`);
            }
            else {
                world.sendMessage(`${playerData.nametag} - ${supertag.id} ready`);
            }
        }
        playerData.supertags = updatedSupertags;
    }
    cooldownManager['saveWorldCooldownData'](allData);
}, 20);
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
