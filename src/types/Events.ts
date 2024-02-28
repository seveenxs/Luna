import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents
export type EventRunner<Key extends EventName> = (...params: ClientEvents[Key]) => void

export interface EventProps<Key extends EventName> {
    name: Key;
    once?: boolean;
    runner: EventRunner<Key>
};