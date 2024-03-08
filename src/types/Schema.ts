export type AnyTypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | MapConstructor | ObjectConstructor | DateConstructor;

export interface ObjectProperty {
  type?: AnyTypeConstructor;
  of?: AnyTypeConstructor;
  required?: Boolean;
  default?: unknown
};

export type ObjectSubProperties = {
  [key: string]: ObjectProperty
}

export type ObjectProperties = {
  [key: string]: ObjectProperty | ObjectSubProperties
}

export type ObjectDefineType<T extends ObjectProperties> = {
  [K in keyof T as T[K] extends ObjectProperties | ObjectSubProperties | ObjectProperty ? K : never]: T[K] extends infer U ?
  U extends ObjectProperties ? ObjectDefineType<U> :
  U extends ObjectProperty ? U["type"] extends AnyTypeConstructor ?
  U["type"] extends StringConstructor ? String :
  U["type"] extends NumberConstructor ? Number :
  U["type"] extends BooleanConstructor ? true | false :
  U["type"] extends ArrayConstructor ? Array<any> :
  U["type"] extends MapConstructor ? Map<any, any> :
  U["type"] extends ObjectConstructor ? Object :
  U["type"] extends DateConstructor ? Date :
  never :
  never :
  never :
  never
}