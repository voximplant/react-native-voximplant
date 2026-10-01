/**
 * @hidden
 */
export interface BaseBusEvent {
  name: string;
}

/**
 * Interface that specifies characteristics about the event listener
 */
export interface ListenerOptions<
  EventList extends BaseBusEvent = BaseBusEvent,
  EventName extends EventList['name'] = EventList['name']
> {
  /**
   * Whether a listener should be invoked at most once after being added.
   * The default value is false.
   */
  once?: boolean;
  /**
   * Function that returns a boolean to determine if the listener should be called.
   * The guard not set by default.
   */
  guard?: (event: Extract<EventList, { name: EventName }>) => boolean;

  /**
   * AbortSignal. The listener is removed when the abort() method of the AbortController which owns the AbortSignal is called.
   * See [AbortController](https://reactnative.dev/docs/global-AbortController) for details.
   */
  signal?: AbortSignal;
}

/**
 * @inline
 * @interface
 * @hidden
 */
export type Listener<
  EventList extends BaseBusEvent,
  EventName extends EventList['name']
> = (event: Extract<EventList, { name: EventName }>) => void | Promise<void>;

/**
 * @inline
 * @hidden
 */
export type AddEventListener<EventList extends BaseBusEvent> = <
  EventName extends EventList['name']
>(
  event: EventName,
  listener: Listener<EventList, EventName>,
  options?: ListenerOptions<EventList, EventName>
) => void;

/**
 * @inline
 * @hidden
 */
export type RemoveEventListener<EventList extends BaseBusEvent> = <
  EventName extends EventList['name']
>(
  event: EventName,
  listener: Listener<EventList, EventName>
) => void;

/**
 * @hidden
 */
export type DispatchEvent<EventList extends BaseBusEvent> = (
  event: Extract<EventList, { name: EventList['name'] }>
) => void;

/**
 * @hidden
 */
export interface EventBus<EventList extends BaseBusEvent> {
  addEventListener: AddEventListener<EventList>;
  removeEventListener: RemoveEventListener<EventList>;
  dispatchEvent: DispatchEvent<EventList>;
}

/**
 * @hidden
 */
export type ListenerEntry<EventList extends BaseBusEvent> = {
  listener: Listener<EventList, EventList['name']>;
  options?: ListenerOptions<EventList, EventList['name']>;
};
