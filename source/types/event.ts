import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents;
export type EventRunner<T extends EventName> = (...params: ClientEvents[T]) => unknown | Promise<unknown>;

export interface Events<T extends EventName> {
    event: T;
    once?: boolean;
    execute: EventRunner<T>
};