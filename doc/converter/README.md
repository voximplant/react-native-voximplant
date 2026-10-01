## How to run

node 22.6.0+ required

to run converter:

```bash
node --experimental-transform-types doc/converter/converter.ts
```

## Converter specific

### Function declaration

use tag `@interface` to expand type to function

```typescript
/**
 * @interface
 */
export type castedFoo = (prop: number) => number;
```

### links

Text within `[]` will be replaced to link to entity if it exists. Full path must
be provided. Will not replace existing MD links

```typescript
/**
 * Here is some link [Core.Api.Item]
 * Here is external link [Example](https://example.com)
 */
const something = 1;
```

### supported jsdoc tags:

- `@deprecated ${reason}`   - deprecate api item with reason.

```typescript
/**
 * @deprecated because we can
 */
const something = 1;
```

- `@since ${version}`       - add version tag

```typescript
/**
 * @since 1.2.3
 */
const something = 1;
```

- `@see ${desctiption}`      - add link to another entity

```typescript
/**
 * @see check this [Core.Api.Item]
 */
const something = 1;
```

- `@method`      - set kind method force

```typescript
export interface replacedInterface {
  some: string;
  /** @method */
  inner: () => void; // documentated as method instead of prop with type function
}
```

- `@cast ${castTo}`           - inject parameters of `castTo` entity

```typescript
export interface Event2Payload {
  eventField1: string,
  eventField2: string,
}

export enum EventName {
  /**
   * @cast EventPayload
   */
  some = "some", // params eventField1, eventField2 will be added to doc
}
```

- `@reinterpret ${reinterpretFrom}` - use all info from `reinterpretFrom` entity, except name

```typescript
export type innerFoo = (badNamedProp: string, privateProp: boolean) => number;

export interface replacedInterface {
  some: string;

  /**
   * @reinterpret ReinterpretedType
   */
  inner: innerFoo;
}

export type ReinterpretedType = (renamedProp: string) => number;
```