import { SchemaProperties, SchemaInferType } from "../../types/Schema";
import { Model } from "mongoose";

export default class LunaDB<T extends SchemaProperties, U extends SchemaInferType<T>> {
    constructor(public model: Model<any>, public props: T) {}

    public async get(id: U['_id']): Promise<U | unknown> {
        const document = await this.model.findById(id);
        return (document) ? document : null;
    }

    public async exists(id: U['_id']): Promise<U | unknown> {
        const status = await this.get(id);
        return !!status
    };


    public async find<K extends keyof U>(id: U['_id'], keys: K): Promise<unknown | U[K]>
    public async find<K extends keyof U>(id: U['_id'], keys: K[]): Promise<unknown | Pick<U, typeof keys[number]>>;
    public async find<K extends (keyof U | Array<keyof U>)>(id: U['_id'], keys: K) {
        let document = await this.get(id) as U;
        if (!document) return null;

        if(typeof keys == "string") return document[keys as keyof U];

        if (Array.isArray(keys)) {
            const object = keys.reduce((acc, curr) => 
            ({ ...acc, [curr]: document[curr] }), {})

            return object as Pick<U, typeof keys[number]>
        }
    }

    public async create(data: Pick<U, '_id'> & Partial<U>, returnDocument: boolean = true): Promise<unknown | U> {
        const document = this.model.create(data)
        return (returnDocument) ? document : null;
    };
}