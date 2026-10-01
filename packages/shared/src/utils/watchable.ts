import { generateUUID } from './uuid';

/**
 * Callback function to be triggered when a value has changed. The return value will be ignored
 *
 * @param newValue New value of the observable property
 * @param oldValue Previous value of the observable property
 *
 * @interface
 * @folder Watchable
 */
export type OnValueChangeCallback<T> = (
  newValue: T,
  oldValue: T
) => unknown | Promise<unknown>;

/**
 * @interface
 * @folder Watchable
 */
export type UnwatchFunction = () => void;

/**
 * @folder Watchable
 */
export interface WatchOptions<T> {
  /**
   * Whether the callback should be called only once. The default value is false.
   */
  once?: boolean;

  /**
   * Function that returns a boolean to determine if the callback should be called.
   * The guard not set by default.
   */
  guard?: (newValue: T, oldValue: T) => boolean;

  /**
   * Whether the callback should be removed after calling the clear method. The default value is true.
   */
  clearable?: boolean;

  /**
   * AbortSignal. The watch callback is removed when the abort() method of the AbortController which owns the AbortSignal is called.
   * See [AbortController](https://reactnative.dev/docs/global-AbortController) for details.
   */
  signal?: AbortSignal;

  /**
   * Whether the callback should be called immediately after being added. The default value is false.
   */
  immediate?: boolean;
}

interface InternalWatchOptions<T> extends WatchOptions<T> {}

const defaultWatchOptions: InternalWatchOptions<unknown> = {
  once: false,
  clearable: true,
  immediate: false,
};

/**
 * Basic reactive type for immutable structures and primitives.
 * It uses strict equality check to determine if the `value` has changed.
 * The value can be set and read any time.
 * @folder Watchable
 */
export interface Watchable<T> {
  /**
   * Current value of the observable property
   */
  value: T;

  /**
   * Previous value of the observable property
   */
  get oldValue(): T;

  /**
   * Subscribes to the value changes.
   *
   * When the value is changed, the [Shared.Watchable.OnValueChangeCallback] callback is triggered.
   *
   * Returns [Shared.Watchable.UnwatchFunction], to unwatch observable value changes.
   *
   * @param onValueChangeCallback Observer to be triggered when the value is changed
   * @param options Options
   */
  watch: (
    onValueChangeCallback: OnValueChangeCallback<T>,
    options?: WatchOptions<T>
  ) => UnwatchFunction;

  /**
   * Stops triggering the specified callback on the value change.
   *
   * @param onValueChangeCallback Observer that should not be triggered anymore
   */
  unwatch: (onValueChangeCallback: OnValueChangeCallback<T>) => void;

  /**
   * Clears all observers for this watchable excluding the ones created with [Shared.Watchable.WatchOptions.clearable]: false.
   */
  clear: () => void;

  /**
   * Locks the watchable from mutations. The value becomes readonly.
   * @hidden
   */
  lock: (key: string) => void;

  /**
   * Unlocks the watchable. The value becomes mutable again.
   * @hidden
   */
  unlock: (key: string) => void;
}

/**
 * Basic reactive type for immutable structures and primitives, the same as [Shared.Watchable], but with readonly values.
 * Setting a new value is ignored without any error, with only a warn message in the console.
 * @folder Watchable
 */
export interface ReadonlyWatchable<T> extends Watchable<T> {}

const lockKeyStore = new Map<string, string | null>();

/**
 * @hidden
 * for QA purposes only
 */
export const watchableConfig = {
  qaIgnoreKeyOnUnlock: false,
};

/**
 * @hidden
 */
class WatchableImpl<T> implements Watchable<T> {
  private readonly id = generateUUID();
  private _content: T;
  private _oldContent: T;
  private readonly observers = new Set<OnValueChangeCallback<T>>();
  private readonly observerOptions = new WeakMap<
    OnValueChangeCallback<T>,
    InternalWatchOptions<T>
  >();

  constructor(content: T) {
    this._content = content;
    this._oldContent = content;
  }

  get oldValue(): T {
    return this._oldContent;
  }

  get value(): T {
    return this._content;
  }

  set value(newValue: T) {
    const key = lockKeyStore.get(this.id);

    if (key && watchableConfig.qaIgnoreKeyOnUnlock) {
      console.error(
        `QA: Unable to set value to readonly watchable. Try to set ${JSON.stringify(
          newValue
        )}, current value is ${JSON.stringify(this._content)}`
      );
      throw new Error(
        `QA: Try to set ${JSON.stringify(
          newValue
        )}, current value is ${JSON.stringify(this._content)}`
      );
    }

    if (key) {
      console.warn(
        `Unable to set value to readonly watchable. Try to set ${JSON.stringify(
          newValue
        )}, current value is ${JSON.stringify(this._content)}`
      );
      return;
    }
    if (newValue === this._content) return;

    this._oldContent = this._content;
    this._content = newValue;
    this.notify();
  }

  watch(
    onValueChangeCallback: OnValueChangeCallback<T>,
    options?: WatchOptions<T>
  ): UnwatchFunction {
    this.observers.add(onValueChangeCallback);
    this.observerOptions.set(onValueChangeCallback, {
      ...defaultWatchOptions,
      ...options,
    });

    if (options?.signal) {
      options.signal.addEventListener(
        'abort',
        () => {
          this.unwatch(onValueChangeCallback);
        },
        { once: true }
      );
    }

    if (
      options?.immediate &&
      (options.guard ? options.guard(this._content, this._oldContent) : true)
    ) {
      onValueChangeCallback(this._content, this._oldContent);
    }

    return () => {
      this.unwatch(onValueChangeCallback);
    };
  }

  unwatch(onValueChangeCallback: OnValueChangeCallback<T>): void {
    this.observers.delete(onValueChangeCallback);
  }

  clear(): void {
    const observers = Array.from(this.observers);
    observers.forEach((observer) => {
      const options = this.observerOptions.get(observer) ?? defaultWatchOptions;
      if (options.clearable) {
        this.unwatch(observer);
      }
    });
  }

  lock(key: string): void {
    if (lockKeyStore.get(this.id)) return;
    lockKeyStore.set(this.id, key);
  }

  unlock(key: string): void {
    if (watchableConfig.qaIgnoreKeyOnUnlock) {
      lockKeyStore.set(this.id, null);
      return;
    }
    if (lockKeyStore.get(this.id) === key) lockKeyStore.set(this.id, null);
  }

  private notify(): void {
    for (const observer of this.observers.values()) {
      try {
        const options =
          this.observerOptions.get(observer) ?? defaultWatchOptions;

        if (options.guard) {
          try {
            const guardResult = options.guard(this._content, this._oldContent);
            if (!guardResult) {
              continue;
            }
          } catch (error) {
            console.error('Unhandled error in guard function', error);
            continue;
          }
        }

        (
          observer(this._content, this._oldContent) as Promise<unknown>
        )?.catch?.((error) => {
          console.error('Unhandled error in async observer', error);
        });

        if (options.once) {
          this.unwatch(observer);
        }
      } catch (error) {
        console.error('Unhandled error in observer', error);
      }
    }
  }
}

/**
 * @hidden
 */
export const createWatchable = <T>(value: T): Watchable<T> => {
  return new WatchableImpl(value);
};

/**
 * @hidden
 */
export const createReadonlyWatchable = <T>(
  value: T,
  key: string
): ReadonlyWatchable<T> => {
  const watchable = new WatchableImpl(value);
  watchable.lock(key);
  return watchable;
};

/**
 * @hidden
 */
export const updateReadonlyWatchableValue = <T>(
  watchable: ReadonlyWatchable<T>,
  value: T,
  key: string
): void => {
  watchable.unlock(key);
  try {
    watchable.value = value;
  } finally {
    watchable.lock(key);
  }
};
