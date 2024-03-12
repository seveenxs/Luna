import { Permissions } from '@constants/permission.json';

import LunaClient from "@classes/Luna";
import LunaEvent from "@classes/Event";
import formatError from '@functions/utils/formatError';

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

        if (!authorDb)
            return message.channel.send(
                formatError('VERIFY_AUTHOR', message.author.username, prefix + 'verificar'));

        if (authorDb.blacklist.banned)
            return message.channel.send(
                formatError('BLACKLISTED_AUTHOR', message.author.username));

        if (!mentionDb && user)
            return message.channel.send(
                formatError('VERIFY_MENTIONED', message.author.username, user?.username));

        if (mentionDb?.banned && user)
            return message.channel.send(
                formatError('BLACKLISTED_MENTIONED', message.author.username, user?.username));

        if (!authorDb.premium && command.exclusive)
            return message.channel.send(
                formatError('USER_IS_PREMIUM', message.author.username, prefix + 'premium'));

        if (command.permission?.author && !message.member?.permissions.has(command.permission?.author || []))
            return message.channel.send(
                formatError('PERMISSIONS_AUTHOR', message.author.username, Translator(command.permission?.author as string[])));

        if (command.permission?.client && !message.guild.members.me?.permissions.has(command.permission?.client || []))
            return message.channel.send(
                formatError('PERMISSIONS_CLIENT', message.author.username, Translator(command.permission?.client as string[])));

        const cooldownMs = cooldown.get(`${message.author.id}`);
        if (cooldown.has(`${message.author.id}`))
            return message.channel.send(
                formatError('USER_IS_IN_COOLDOWN', message.author.username, ~~(cooldownMs / 1000)));

        cooldown.set(`${message.author.id}`, +Date.now() + 5000);
        setTimeout(() => cooldown.delete(`${message.author.id}`), 5000);

        try {
            command.execute({ client, message, args });
        } catch (error) {
            console.log(`${command.name}: ${error}`);
        }
    }
})