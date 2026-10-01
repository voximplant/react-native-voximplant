import {
  createEventBus,
  type AddEventListener,
  type DispatchEvent,
  type ListenerOptions,
  type RemoveEventListener,
} from '@voximplant/react-native-shared';
import NativeCalls from '../../../specs/calls.native-spec';
import {
  CallRepository,
  type Call,
  type CallId,
  type CallSettings,
} from '../call';
import {
  ConferenceRepository,
  type Conference,
  type ConferenceId,
  type ConferenceSettings,
} from '../conference';
import {
  CallManagerEvent,
  type AnyCallManagerEvent,
} from './callManager.events';

/**
 * Call manager for creating and managing calls and conferences.
 *
 * @hideconstructor
 */
export abstract class CallManager {
  private static instance: CallManager | null = null;

  /**
   * Returns the instance of the call manager.
   */
  public static getInstance(): CallManager {
    if (!CallManager.instance) {
      CallManager.instance = new CallManagerImpl();
    }
    return CallManager.instance;
  }

  protected constructor() {}

  /**
   * Returns a map of actual calls with their ids.
   */
  abstract get calls(): Map<CallId, Call>;

  /**
   * Returns a map of actual conferences with their ids.
   */
  abstract get conferences(): Map<ConferenceId, Conference>;

  /**
   * Creates a new call instance.
   *
   * The call should be started via the [Calls.Call.Call.start] method.
   *
   * Returns the created call instance or null if the call creation failed.
   *
   * @param destination SIP URI, username or phone number to make call to. Actual routing is then performed by a VoxEngine scenario.
   * @param settings Call settings with additional call parameters, such as the preferred video codec, custom data, extra headers, etc.
   */
  abstract createCall(
    destination: string,
    settings?: CallSettings
  ): Call | null;

  /**
   * Creates a new conference instance.
   *
   * Returns the created conference instance or null if the conference creation failed.
   *
   * @param conferenceName Name of the conference
   * @param settings Conference settings with additional conference parameters, such as the preferred video codec, custom data, extra headers, etc.
   */
  abstract createConference(
    conferenceName: string,
    settings?: ConferenceSettings
  ): Conference | null;

  /**
   * @reinterpret Calls.DocCallManagerAddEventListener
   */
  abstract addEventListener: AddEventListener<AnyCallManagerEvent>;

  /**
   * @reinterpret Calls.DocCallManagerRemoveEventListener
   */
  abstract removeEventListener: RemoveEventListener<AnyCallManagerEvent>;
}

/**
 * @hidden
 */
class CallManagerImpl extends CallManager {
  private readonly callRepository: CallRepository;
  private readonly conferenceRepository: ConferenceRepository;

  public addEventListener: AddEventListener<AnyCallManagerEvent>;
  public removeEventListener: RemoveEventListener<AnyCallManagerEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyCallManagerEvent>;

  constructor() {
    super();

    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyCallManagerEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.callRepository = new CallRepository(NativeCalls);
    this.conferenceRepository = new ConferenceRepository(NativeCalls);

    this.bridgeNativeEvents();
  }

  public get calls(): Map<CallId, Call> {
    return this.callRepository.getMap();
  }

  public get conferences(): Map<ConferenceId, Conference> {
    return this.conferenceRepository.getMap();
  }

  public createCall(destination: string, settings?: CallSettings): Call | null {
    return this.callRepository.create(destination, settings);
  }

  public createConference(
    conferenceName: string,
    settings?: ConferenceSettings
  ): Conference | null {
    return this.conferenceRepository.create(conferenceName, settings);
  }

  private bridgeNativeEvents(): void {
    NativeCalls.onCallDisconnected(({ callId }) => {
      this.callRepository.remove(callId);
    });

    NativeCalls.onCallFailed(({ callId }) => {
      this.callRepository.remove(callId);
    });

    NativeCalls.onConferenceDisconnected(({ conferenceId }) => {
      this.conferenceRepository.remove(conferenceId);
    });

    NativeCalls.onConferenceFailed(({ conferenceId }) => {
      this.conferenceRepository.remove(conferenceId);
    });

    NativeCalls.onIncomingCall((event) => {
      this.callRepository.storeCall(event.callId);

      this.dispatchEvent({
        name: CallManagerEvent.IncomingCall,
        payload: {
          callId: event.callId,
          withVideo: event.withVideo,
          headers: event.headers,
        },
      });
    });
  }
}

/**
 * @interface
 * @internal
 *
 * Registers a handler for the specified event.
 *
 * One event can have more than one handler; handlers are executed in order of their registration.
 */
export type DocCallManagerAddEventListener = (
  /**
   * Event name
   */
  eventName: CallManagerEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyCallManagerEvent) => void | Promise<void>,
  /**
   * Object that specifies characteristics about the event listener
   */
  options: ListenerOptions
) => void;

/**
 * @interface
 * @internal
 *
 * Removes a previously registered handler for the specified event.
 */
export type DocCallManagerRemoveEventListener = (
  /**
   * Event name
   */
  eventName: CallManagerEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyCallManagerEvent) => void | Promise<void>
) => void;
