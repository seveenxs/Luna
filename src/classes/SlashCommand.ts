import { ApplicationCommandType } from "discord.js";
import { SlashCommandData, SlashCommandPermission, SlashCommandProps, SlashCommandRunner, autoComplete } from "../types/SlashCommand";

export default class SlashCommand<T extends ApplicationCommandType> implements SlashCommandProps<T> {
    declare data: SlashCommandData;
    declare type: T;
    declare execute: SlashCommandRunner<T>;

    public autoComplete?: autoComplete | undefined;
    public permission?: SlashCommandPermission | undefined;

    public constructor(properties: SlashCommandProps<T>) {
        Object.assign(this, properties);
    }
}
