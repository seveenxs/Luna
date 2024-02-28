import { ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver, MessageContextMenuCommandInteraction, PermissionResolvable, UserContextMenuCommandInteraction } from "discord.js"

/* SLASHED COMMAND */
export type SlashCommandInteraction<T extends ApplicationCommandType> = 
T extends 1 ? ChatInputCommandInteraction :
T extends 2 ? UserContextMenuCommandInteraction :
T extends 3 ? MessageContextMenuCommandInteraction :
never;

export type SlashCommandRunner<T extends ApplicationCommandType> = (interaction: SlashCommandInteraction<T>) => any | Promise<any>;
export type autoComplete = (interaction: AutocompleteInteraction) => any | Promise<any>;

export interface SlashCommandData {
    name: string;
    description: string;
    options?: CommandInteractionOption;
}

export interface SlashCommandPermission {
    author?: PermissionResolvable[] | PermissionResolvable;
    client?: PermissionResolvable[] | PermissionResolvable;
}

export interface SlashCommandProps<T extends ApplicationCommandType> {
    data: SlashCommandData;
    type: T;
    permission?: SlashCommandPermission;
    execute: SlashCommandRunner<T>;
    autoComplete?: autoComplete;
};