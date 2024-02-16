import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver, MessageContextMenuCommandInteraction, PermissionResolvable, UserContextMenuCommandInteraction } from "discord.js"

/* SLASHED COMMAND */
export type SlashCommandInteraction<T extends ApplicationCommandType> = 
T extends 1 ? ChatInputCommandInteraction :
T extends 2 ? UserContextMenuCommandInteraction :
T extends 3 ? MessageContextMenuCommandInteraction :
never;

export type SlashCommandRunner<T extends ApplicationCommandType> = (interaction: SlashCommandInteraction<T>) => unknown | Promise<unknown>;
export type autoComplete = (interaction: AutocompleteInteraction) => unknown | Promise<unknown>;

export interface SlashCommandData {
    name: string;
    description: string;
    options?: CommandInteractionOption;
}

export interface CommandPermissions {
    author: PermissionResolvable[] | PermissionResolvable;
    client: PermissionResolvable[] | PermissionResolvable;
}

export interface SlashedCommand<T extends ApplicationCommandType> {
    data: SlashCommandData;
    type: T;
    permission?: CommandPermissions;
    execute: SlashCommandRunner<T>;
    autoComplete?: autoComplete;
};