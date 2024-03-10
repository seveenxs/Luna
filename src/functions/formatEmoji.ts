import { LunaGlobal } from '@constants/emojis.json';

export default function formatEmoji(text: string) {
    const emotesData = Object.entries(LunaGlobal);
    const emoteRegex = new RegExp(/#(\w+)/, 'g');

    return text
    .replace(emoteRegex, (_, keyword) => emotesData.find(([name, _]) => keyword === name)?.[1] || keyword);
};