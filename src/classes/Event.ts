import { EventProps, EventName, EventRunner } from '../types/Events'

export default class LunaEvent<T extends EventName> implements EventProps<T> {
    declare name: T;
    declare runner: EventRunner<T>;
    public once?: boolean | undefined;

    public constructor(properties: EventProps<T>) {
        Object.assign(this, properties);
    };
};