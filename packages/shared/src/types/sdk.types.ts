import type { PlainObject } from './common.types';

/**
 * Set of headers. Names should begin with “X-” to be processed by the SDK.
 * @internal
 */
export type ExtraHeaders = PlainObject<string>;
