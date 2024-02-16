import { Client } from "discord.js";
import { LunaProps } from "../types/luna";

export default class LunaClient extends Client {
    constructor(properties: LunaProps) {
        super({ intents: properties.intents });
    };
}