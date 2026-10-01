/**
 * @hidden
 */
export function assertUnreachable(value: never): void {
  throw new Error(`Unreachable case: ${String(value)}`);
}
