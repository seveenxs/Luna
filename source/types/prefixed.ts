import LunaClient from "@classes/luna";
import { LunaCategories } from '@constants/emojis.json'
import { Message, PermissionResolvable } from "discord.js";

/* PREFIXED COMMANDS */
export type PrefixedCommandCategory = keyof typeof LunaCategories;
export type PrefixedCommandRunner = (options: { client: LunaClient, message: Message, args: string[]}) => unknown | Promise<unknown>;

export interface CommandInformations {
    description: string;
    howToUsage: string;
    category: PrefixedCommandCategory
}

export interface CommandPermissions {
    author: PermissionResolvable[] | PermissionResolvable;
    client: PermissionResolvable[] | PermissionResolvable;
}

export interface PrefixedCommand {
    name: string;
    aliases?: string[];
    information: CommandInformations;
    private?: boolean;
    exclusive?: boolean;
    permission?: CommandPermissions;
    execute: PrefixedCommandRunner;
}