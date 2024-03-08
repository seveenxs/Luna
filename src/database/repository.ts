import { Model, QueryOptions, UpdateQuery } from "mongoose";
import { ObjectProperties, ObjectDefineType } from "src/types/Schema";

export default class Repository<T extends ObjectProperties, U extends ObjectDefineType<T>> {
    constructor(public model: Model<any>, public object: T) {}

    public async exists(id: String): Promise<true | null> {
        return (await this.model.findById(id)) ? true : null;
    }

    public async remove(id: String): Promise<U | null> {
        return await this.model.findByIdAndDelete(id);
    }

    public async create(data: Partial<U>, returnDocument: boolean = false): Promise<U | null> {
        const document = await this.model.create(data);
        return returnDocument ? document : null
    }

    public async get(id: String): Promise<U | null> {
        return await this.model.findById(id) || null;
    }

    public async update(id: String, update: UpdateQuery<Omit<U, '_id'>>, options?: QueryOptions<U>): Promise<U | null> {
        const document = await this.model.findByIdAndUpdate({ _id: id }, update, options)
        return (options?.new) ? document : null
    }

    public async findAll(projection?: { [K in keyof U]: 0 | 1 } | {}, filter?: (params: U) => boolean): Promise<U[] | null> {
        let document = await this.model.find({}, projection) as U[];
        if (filter) document = document.filter(filter);
        return document.length > 0  ? document : null;
    };

    public async find<K extends keyof U>(id: String, keys: K): Promise<null | U[K]>
    public async find<K extends Array<keyof U>>(id: String, keys: K): Promise<null | Pick<U, typeof keys[number]>>;
    public async find<K extends (keyof U | Array<keyof U>)>(id: String, keys: K) {
        let document = await this.get(id) as U;
        if (!document) return null;

        if(typeof keys == "string") return document[keys as keyof U];

        if (Array.isArray(keys)) {
            const object = keys.reduce((acc, curr) => 
            ({ ...acc, [curr]: document[curr] }), {})

            return object as Pick<U, typeof keys[number]>
        }
    }
}