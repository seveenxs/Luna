import { LunaGlobal } from '@constants/emojis.json';

export default function formatEmoji(text: string) {
    const emotesData = Object.entries(LunaGlobal);
    const emoteRegex = new RegExp(/\[(.*?)\]/, 'g');

    return text
    .replace(emoteRegex, (match, keyword) => emotesData.find(([name, value]) => keyword === name)?.[1] || keyword);
};