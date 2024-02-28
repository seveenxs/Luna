import { ComponentProps, AnyInteractionComponent, ComponentRunner } from '../types/Components'

export default class Component<T extends AnyInteractionComponent> implements ComponentProps<T> {
    declare customId: string;
    declare component: T;
    declare runner: ComponentRunner<T>;
    public private?: boolean | undefined;
    
    public constructor(properties: ComponentProps<T>) {
        Object.assign(this, properties);
    }
}