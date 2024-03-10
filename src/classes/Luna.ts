import colorize from 'strcolorize';
import { globSync } from 'glob';
import { ApplicationCommandType, Client, Collection } from "discord.js";

import PrefixCommand from "./PrefixCommand";
import SlashCommand from "./SlashCommand";
import Component from "./Component";
import LunaEvent from "./Event";

import { AnyInteractionComponent } from "../types/Components";
import { EventName } from "../types/Events";
import LunaProps from "../types/Luna";

import { lunaDB } from '@database'

export default class LunaClient extends Client {
    public db: typeof lunaDB = lunaDB

    private static instance: LunaClient;
    public static LunaInstance() { return LunaClient.instance };

    public PrefixCommands: Collection<string, PrefixCommand> = new Collection();
    public SlashCommands: Collection<string, SlashCommand<ApplicationCommandType>> = new Collection();
    public components: Collection<string, Component<AnyInteractionComponent>> = new Collection();
    public events: Collection<string, LunaEvent<EventName>> = new Collection();

    public constructor(public props: LunaProps) {
        super({ intents: props.intents });

        LunaClient.instance = this;
        this.connect(this.props.token);
    }

    public connect(token: string): void {
        super.login(token)
        .then(() => {
            colorize('[Luna](#800399) está observando as estrelas ⭐✨', true);

            this.loadEvents();
            this.loadCommands();
        })
        .catch((error) => colorize(`[[✖](red) An [error](red) occurred while attempting to connect to the client:](bold) \n${error}`, true));
    }

    private async loadEvents(): Promise<void> {
        const eventFiles: string[] = globSync('src/luna/events/**/*.{js,ts}');

        for (const eventFile of eventFiles) {
            const event = (await import(eventFile)).default as LunaEvent<EventName>;
            if (!event.name || !event.runner) return;

            if (event.once) this.once(event.name, event.runner);
            else this.on(event.name, event.runner);

            this.events.set(event.name, event);
            colorize(`Event [${event.name}](#f58442)[[${eventFile.split('\\').slice(-1).join('')}](bold green)] successful to load.`, true)
        };
    };

    private async loadCommands(): Promise<void> {
        const prefixCommandFiles = globSync('src/luna/commands/prefix/**/*.{js,ts}');
        const slashCommandFiles = globSync('src/luna/commands/slash/**/*.{js,ts}');

        for (const prefixCommand of prefixCommandFiles) {
            const command = (await import(prefixCommand)).default as PrefixCommand;
            if (!command) return;

            this.PrefixCommands.set(command.name, command);
            colorize(`PrefixCommand [${command.name}](#f58442)[[${prefixCommand.split('\\').slice(-1).join('')}](bold green)] successful to load.`, true)
        }

        for (const slashCommand of slashCommandFiles) {
            const command = (await import(slashCommand)).default as SlashCommand<ApplicationCommandType>;
            if (!command) return;

            this.SlashCommands.set(command.data.name, command);
            colorize(`SlashCommand [${command.data.name}](#f58442)[[${slashCommand.split('\\').slice(-1).join('')}](bold green)] successful to load.`, true)
        }
    }
}