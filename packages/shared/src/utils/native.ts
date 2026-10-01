import {
  NativeEventEmitter,
  NativeModules,
  TurboModuleRegistry,
  type EventSubscription,
  type TurboModule,
} from 'react-native';

/**
 * @hidden
 */
declare global {
  var nativeFabricUIManager: object | undefined;
}

/**
 * @hidden
 */
export function isNewArchEnabled(): boolean {
  const hasFabricBinding =
    typeof globalThis.nativeFabricUIManager === 'object' &&
    globalThis.nativeFabricUIManager !== null;

  return hasFabricBinding;
}

/**
 * @hidden
 */
export const resolveNativeModule = <Spec extends TurboModule>(
  name: string
): Spec => {
  if (isNewArchEnabled()) {
    return TurboModuleRegistry.getEnforcing<Spec>(name);
  }

  return NativeModules[name] as Spec;
};

/**
 * @hidden
 */
const EVENT_PROP_RE = /^on[A-Z]/;

/**
 * @hidden
 */
const isEventProp = (prop: string | symbol): prop is string =>
  typeof prop === 'string' && EVENT_PROP_RE.test(prop);

/**
 * @hidden
 */
export function withLegacyEvents<T extends TurboModule>(
  name: string,
  turboModule: T | null
): T {
  if (isNewArchEnabled()) return turboModule as T;

  const module = NativeModules[name] as T;
  const eventEmitter = new NativeEventEmitter(NativeModules[name]);

  const addLegacyListener = (
    eventName: string
  ): ((listener: (payload: unknown) => void) => EventSubscription) => {
    return (listener) => eventEmitter.addListener(eventName, listener);
  };

  return new Proxy(module, {
    get(target, eventName, receiver) {
      if (isEventProp(eventName) && !(eventName in target)) {
        return addLegacyListener(eventName);
      }
      return Reflect.get(target, eventName, receiver);
    },
  }) as T;
}
