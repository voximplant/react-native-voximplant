import type {
  BaseBusEvent,
  Listener,
  ListenerEntry,
  ListenerOptions,
} from './eventBus.types';

/**
 * @hidden
 */
export const toListenerEntry = <
  EventList extends BaseBusEvent,
  EventName extends EventList['name']
>(
  listener: Listener<EventList, EventName>,
  options?: ListenerOptions<EventList, EventName>
): ListenerEntry<EventList> => {
  return {
    listener,
    options,
  } as unknown as ListenerEntry<EventList>;
};
