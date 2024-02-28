import LunaEvent from "@classes/Event";
import LunaClient from "@classes/Luna";

export default new LunaEvent({
    name: 'messageCreate',
    runner: (message) => {
        const LunaInstance = LunaClient.LunaInstance();

        if (!LunaInstance['properties'].cosmics.includes(message.author.id as `${number}`)) return;
        message.channel.send('Opa, bão?');
    }
})