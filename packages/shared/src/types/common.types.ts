/**
 * @internal
 */
export type PlainObject<T = unknown> = Record<string, T>;

/**
 * @internal
 */
export type UnknownObject = PlainObject<unknown>;

/**
 * @hidden
 */
export type WithId<Id> = {
  id: Id;
};
