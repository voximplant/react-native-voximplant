import { toListenerEntry } from './eventBus.utils';
import {
  type AddEventListener,
  type BaseBusEvent,
  type DispatchEvent,
  type EventBus,
  type Listener,
  type ListenerEntry,
  type ListenerOptions,
  type RemoveEventListener,
} from './eventBus.types';

/**
 * @hidden
 */
export const createEventBus = <
  EventList extends BaseBusEvent
>(): EventBus<EventList> => {
  const entries = new Map<EventList['name'], ListenerEntry<EventList>[]>();

  const addEventListener: AddEventListener<EventList> = <
    EventName extends EventList['name']
  >(
    event: EventName,
    listener: Listener<EventList, EventName>,
    options?: ListenerOptions<EventList, EventName>
  ): void => {
    const eventEntries = entries.get(event);
    const newEntry = toListenerEntry(listener, options);

    if (eventEntries?.length) entries.set(event, [...eventEntries, newEntry]);
    else entries.set(event, [newEntry]);

    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        removeEventListener(event, listener);
      });
    }
  };

  const removeEventListener: RemoveEventListener<EventList> = (
    event,
    listener
  ): void => {
    const eventEntries = entries.get(event);
    if (!eventEntries) return;

    const newEntries = eventEntries.filter(
      (entry) => !Object.is(entry.listener, listener)
    );

    if (newEntries.length) entries.set(event, newEntries);
    else entries.delete(event);
  };

  const dispatchEvent: DispatchEvent<EventList> = (event): void => {
    const eventEntries = entries.get(event.name);

    if (!eventEntries) return;

    Promise.all(
      eventEntries.map(async ({ listener, options }) => {
        if (options?.guard) {
          try {
            if (!options.guard(event)) {
              return;
            }
          } catch (e) {
            console.error('Unhandled error in guard function', event, e);
            return;
          }
        }

        if (options?.once) {
          removeEventListener(event.name, listener);
        }

        try {
          await listener(event);
        } catch (e) {
          console.error('Unhandled error at event listener', event, e);
        }
      })
    ).catch((e) => {
      console.error('Dispatch event ', event, ' failed with error ', e);
    });
  };

  return {
    addEventListener,
    removeEventListener,
    dispatchEvent,
  };
};
