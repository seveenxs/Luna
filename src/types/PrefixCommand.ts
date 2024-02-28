import LunaClient from "@classes/Luna";
import { LunaCategories } from '@constants/emojis.json'
import { Message, PermissionResolvable } from "discord.js";

/* PREFIXED COMMANDS */
export type PrefixCommandCategory = keyof typeof LunaCategories;
export type PrefixCommandRunner = (options: { client: LunaClient, message: Message, args: string[]}) => any | Promise<any>;

export interface PrefixCommandInformation {
    description: string;
    howToUsage: string;
    category: PrefixCommandCategory
}

export interface PrefixCommandPermission {
    author: PermissionResolvable[] | PermissionResolvable;
    client: PermissionResolvable[] | PermissionResolvable;
}

export interface PrefixCommandProps {
    name: string;
    aliases?: string[];
    information: PrefixCommandInformation;
    private?: boolean;
    exclusive?: boolean;
    permission?: PrefixCommandPermission;
    execute: PrefixCommandRunner;
}