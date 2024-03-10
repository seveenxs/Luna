import { Permissions } from '@constants/permission.json';
import { MESSAGES } from '@constants/messages.json';

import LunaClient from "@classes/Luna";
import LunaEvent from "@classes/Event";
import formatEmoji from '@functions/formatEmoji';

const cooldown = new Map();
const Translator = (input: string[]) => input.map(p => `\`${Permissions[p as keyof typeof Permissions]}\`` || p).join(', ');

export default new LunaEvent({
    name: 'messageCreate',
    runner: async (message) => {
        if (message.author.bot || !message.guild) return;
        const client = LunaClient.LunaInstance();

        let prefix = await client.db.guild.find(message.guild.id, 'prefix') as string;
        if (!prefix) prefix = await client.db.guild.create({ _id: message.guild.id }, true).then(doc => doc?.prefix) as string;

        if (message.content.replace('!', '').startsWith(`<@${client.user?.id}>`))
            return message.channel.send({
                content: `✨ **› Saudações** <@${message.author.id}>, tudo bem? eu sou a **Luna**! o meu prefixo neste servidor é \`${prefix}\`, verifique os meus comandos  utlizando \`${prefix}comandos\`.`,
                allowedMentions: { parse: [] }
            });

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.trim().slice(prefix.length).split(/ +/g);
        const cmd = args.shift()?.toLowerCase();
        const command = client.PrefixCommands.find((c) => c.name === cmd || (c.aliases && c.aliases.includes(cmd!)));

        if (!command) return;

        const mentions = message.mentions.users.first()
        const user = mentions || client.users.cache.find((u) => args.some((a) => a === u.id || a === u.username));

        const authorDb = await client.db.user.find(message.author.id, ['blacklist', 'premium']);
        const mentionDb = await client.db.user.find(user?.id!, 'blacklist');

        if (!authorDb || !mentionDb && user)
            return message.channel.send({
                content: formatEmoji(!authorDb ? MESSAGES.VERIFY.AUTHOR : MESSAGES.VERIFY.MENTION)
                    .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'comando' ? prefix + 'verificar' : keyword === 'mencao' ? user?.username : keyword),
                allowedMentions: { parse: [] }
            });

        if (authorDb.blacklist.banned || mentionDb?.banned && user)
            return message.channel.send({
                content: formatEmoji(authorDb.blacklist.banned ? MESSAGES.BLACKLIST.AUTHOR : MESSAGES.BLACKLIST.MENTION)
                    .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'mencao' ? user?.username : keyword),
                allowedMentions: { parse: [] }
            });

        if (!authorDb.premium && command.exclusive)
            return message.channel.send({
                content: formatEmoji(MESSAGES.PREMIUM)
                    .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'comando' ? prefix + 'premium' : keyword === 'mencao' ? user?.username : keyword),
                allowedMentions: { parse: [] }
            });

        if (command.permission?.author && !message.member?.permissions.has(command.permission?.author || []))
            return message.channel.send({
                content: formatEmoji(MESSAGES.PERMISSION.AUTHOR)
                .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'permissoes' ? Translator(command.permission?.author as string[]) : keyword),
                allowedMentions: { parse: [] }
            });

        if (command.permission?.client && !message.guild.members.me?.permissions.has(command.permission?.client || []))
            return message.channel.send({
                content: formatEmoji(MESSAGES.PERMISSION.CLIENT)
                .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'permissoes' ? Translator(command.permission?.client as string[]) : keyword),
                allowedMentions: { parse: [] }
            });

        const cooldownMs = cooldown.get(`${message.author.id}`);

        if (cooldown.has(`${message.author.id}`))
            return message.channel.send({
                content: formatEmoji(MESSAGES.COOLDOWN)
                    .replace(/\[(\w+)\]/g, (_, keyword) => keyword === 'autor' ? message.author.username : keyword === 'cooldown' ? ~~(cooldownMs / 1000) : keyword),
                allowedMentions: { parse: [] }
            });

        cooldown.set(`${message.author.id}`, +Date.now() + 5000);
        setTimeout(() => cooldown.delete(`${message.author.id}`), 5000);

        try {
            command.execute({ client, message, args });
        } catch (error) {
            console.log(`${command.name}: ${error}`);
        }
    }
})