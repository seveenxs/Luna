import * as util from 'util';

import LunaEvent from "@classes/Event";
import LunaClient from "@classes/Luna";

export default new LunaEvent({
    name: 'messageCreate',
    runner: async (message) => {
        const LunaInstance = LunaClient.LunaInstance();

        if (!LunaInstance['properties'].cosmics.includes(message.author.id as `${number}`)) return;

        const prefix = 'l!';
        const args = message.content.trim().slice(prefix.length).split(' ');
        const commandName = args.shift();

        if (commandName == 'eval') {
            const code = args.join(' ');

            try {
            const evaled = eval(code);

            if(evaled instanceof Promise) await evaled;

            message.reply({ content: `\`\`\`js\n${util.inspect(evaled).slice(0,1950)}\`\`\`` });
            } catch(error) {
            const errorMessage = (error as Error).message;
            
            message.reply({ content: `\`\`\`js\n${errorMessage}\`\`\`` });
            } 
        }
    }
})