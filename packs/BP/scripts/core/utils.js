export const infinity = 999999 * 20;
export function checkPower(player, power) {
    const allTags = player.getTags();
    return allTags.some(tag => tag === `supertag:${power.name}`);
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
