# Code of conduct

## Table of Contents

- [Types](#types)
  - [Enum](#enum)
- [Errors](#errors)
  - [Native Errors](#native-errors)
- [Native Spec](#native-spec)
  - [Getters](#getters)
  - [Properties](#properties)


## Types

### Enum

Enum style should be:

- Keys in `PascalCase`
- Values in `SCREAMING_SNAKE_CASE` by default, unless the purpose requires otherwise

```typescript
enum Enum {
  FirstKey = 'FIRST_KEY', // constant value
  UrlToSomeThing = 'www.google.com',
  MappedToSomeOtherService = 'value_from_backend',
}
```

## Errors

### Native Errors

Errors thrown from native modules must have a `code` (screaming snake case) and a `message`:

```typescript
{
  code: 'SCREAMING_SNAKE_CASE',
  message: 'Human readable description',
}
```

## Native Spec

### Getters

Android has issues with `get` accessors in `TurboModule` specs. Use regular methods prefixed with `get` instead:

```typescript
// ✅
interface Spec extends TurboModule {
  getClientState(): ClientState;
}

// ❌
interface Spec extends TurboModule {
  get clientState(): ClientState; // ❌ android has issues with get accessors
  clientState: ClientState;       // ❌ plain properties are not supported on either platform
}

```

### Properties

Plain property declarations are not supported by Codegen on either platform. Use methods instead:

```typescript
// ✅
interface Spec extends TurboModule {
  getVolume(): number;
  getName(): string;
  isEnabled(): boolean;
}

// ❌
interface Spec extends TurboModule {
  volume: number;
  name: string;
  enabled: boolean;
}
```
