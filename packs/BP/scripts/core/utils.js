export function checkPower(player, power) {
    const allTags = player.getTags();
    const superTag = allTags.find(tag => tag.startsWith("supertag:"));
    if (superTag) {
        return superTag.split(":")[1] === power.name;
    }
    else
        return false;
}
export function generateRandomID(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
