/**
 * Returns a callback that runs `fn(object)` without keeping `object` alive.
 *
 * Use it to prevent pinning `object` when the callback outlives it.
 * If `object` is gone, the callback does nothing.
 *
 * @hidden
 */
export function weakBind<T extends object, A extends unknown[]>(
  object: T,
  fn: (target: T, ...args: A) => void,
  ...args: A
): () => void {
  const ref = new WeakRef(object);
  return () => {
    const target = ref.deref();
    if (target) fn(target, ...args);
  };
}
