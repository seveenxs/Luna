export type SchemaPropertyType = NumberConstructor | StringConstructor | BooleanConstructor | ArrayConstructor | MapConstructor | DateConstructor;

export type SchemaProperty = { 
  type?: SchemaPropertyType,
  of?: SchemaPropertyType
  required?: boolean,
  default?: unknown 
} | SchemaSubProperties

export type SchemaProperties = {
  [x: string]: SchemaProperty | SchemaSubProperties
} & {
  _id: { type: StringConstructor, required: boolean }
}

export interface SchemaSubProperties {
  [x: string]: SchemaProperty
}

export type SchemaInferType<T extends SchemaProperties> = {
  [K in keyof T as T[K] extends SchemaProperties | SchemaProperty ? K : never]: T[K] extends infer U ? 
    U extends SchemaProperties ? SchemaInferType<U> :   
      U extends SchemaProperty ?
       U["type"] extends SchemaPropertyType ?
        U["type"] extends NumberConstructor ? number :
        U["type"] extends StringConstructor ? string :
        U["type"] extends BooleanConstructor ? boolean :
        U["type"] extends ArrayConstructor ? Array<unknown> :
        U["type"] extends MapConstructor ? Map<unknown, unknown> :
        U["type"] extends DateConstructor ? Date :
        never :      
      never :
    never :
  never
} & {
  _id: string
}