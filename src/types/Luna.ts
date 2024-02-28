import { IntentsBitField, GatewayIntentBits } from 'discord.js'

export type LunaIntents = IntentsBitField | GatewayIntentBits;
export type LunaCosmics = `${number}`;

export default interface LunaProps {
    token: string; 
    cosmics: LunaCosmics[]; /* ARRAY CONTAINING THE DEVELOPER' IDS. */
    intents: LunaIntents[] | number;
};