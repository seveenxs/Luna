import { ButtonInteraction, ChannelSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

export type AnyInteractionComponent =
'Button' | 'StringSelectMenu' | 'UserSelectMenu' | 'ChannelSelectMenu' | 'RoleSelectMenu';

export type InteractionComponentType<T extends AnyInteractionComponent> =
T extends 'Button' ? ButtonInteraction :
T extends 'StringSelectMenu' ? StringSelectMenuInteraction :
T extends 'UserSelectMenu' ? UserSelectMenuInteraction :
T extends 'ChannelSelectMenu' ? ChannelSelectMenuInteraction :
T extends 'RoleSelectMenu' ? RoleSelectMenuInteraction :
never;

export type ComponentRunner<T extends AnyInteractionComponent> =
(options: { interaction: InteractionComponentType<T>, args: string[] }) => any | Promise<any>;

export interface ComponentProps<T extends AnyInteractionComponent> {
    customId: string;
    component: T;
    private?: boolean
    runner: ComponentRunner<T>
};