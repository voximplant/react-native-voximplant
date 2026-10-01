import {
  createEventBus,
  createReadonlyWatchable,
  generateUUID,
  SubscriptionStore,
  updateReadonlyWatchableValue,
  type AddEventListener,
  type DispatchEvent,
  type ExtraHeaders,
  type ReadonlyWatchable,
  type RemoveEventListener,
} from '@voximplant/react-native-shared';
import NativeCalls from '../../../specs/calls.native-spec';
import { type LocalVideoStream } from '../../video';
import { toCallError } from '../calls.mappers';
import { CallsLocalVideoStreamRepository } from '../internal';
import {
  ConferenceEvent,
  type AnyConferenceEvent,
  type ConferenceConnectedPayload,
  type ConferenceDisconnectedPayload,
  type ConferenceEndpointAddedPayload,
  type ConferenceEndpointRemovedPayload,
  type ConferenceFailedPayload,
} from './conference.events';
import {
  ConferenceState,
  type Conference,
  type ConferenceId,
} from './conference.types';
import { EndpointRepository, type Endpoint } from './endpoint';

const watchableKey = generateUUID();

/**
 * @hidden
 */
export interface ConferenceData {
  readonly id: ConferenceId;
}

/**
 * @hidden
 */
export class ConferenceImpl implements Conference {
  public readonly id: ConferenceId;

  public readonly state: ReadonlyWatchable<ConferenceState>;
  public readonly endpointId: ReadonlyWatchable<string | null>;
  public readonly isMuted: ReadonlyWatchable<boolean>;
  public readonly isVoiceActivityDetected: ReadonlyWatchable<boolean>;
  public readonly endpoints: ReadonlyWatchable<Endpoint[]>;
  public readonly localVideoStreams: ReadonlyWatchable<LocalVideoStream[]>;

  public addEventListener: AddEventListener<AnyConferenceEvent>;
  public removeEventListener: RemoveEventListener<AnyConferenceEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyConferenceEvent>;

  private readonly endpointRepository: EndpointRepository;
  private readonly localVideoStreamRepository: CallsLocalVideoStreamRepository;
  private readonly subscriptions: SubscriptionStore;

  constructor(data: ConferenceData) {
    this.id = data.id;

    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyConferenceEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.subscriptions = new SubscriptionStore();

    this.endpointRepository = new EndpointRepository({
      conferenceId: this.id,
      native: NativeCalls,
    });

    this.localVideoStreamRepository = new CallsLocalVideoStreamRepository({
      callId: this.id,
      native: NativeCalls,
    });

    this.state = createReadonlyWatchable(
      NativeCalls.getStateForConference(this.id),
      watchableKey
    );

    this.endpointId = createReadonlyWatchable(
      NativeCalls.getEndpointIdForConference(this.id),
      watchableKey
    );

    this.isMuted = createReadonlyWatchable(
      NativeCalls.getIsMuted(this.id),
      watchableKey
    );

    this.isVoiceActivityDetected = createReadonlyWatchable(false, watchableKey);

    this.endpoints = createReadonlyWatchable(
      this.endpointRepository.getList(),
      watchableKey
    );

    this.localVideoStreams = createReadonlyWatchable(
      this.localVideoStreamRepository.getList(),
      watchableKey
    );

    this.bridgeNativeEvents();
  }

  public get duration(): number {
    return NativeCalls.getDuration(this.id);
  }

  public join(): void {
    try {
      return NativeCalls.joinForConference(this.id);
    } catch (err) {
      throw toCallError(err);
    }
  }

  public hangup(headers?: ExtraHeaders): void {
    return NativeCalls.hangup(this.id, headers ?? null);
  }

  public mute(value: boolean): void {
    NativeCalls.mute(this.id, value);

    updateReadonlyWatchableValue(this.isMuted, value, watchableKey);
  }

  public sendMessage(text: string): void {
    return NativeCalls.sendMessage(this.id, text);
  }

  public sendInfo(
    mimeType: string,
    body: string,
    headers?: ExtraHeaders
  ): void {
    return NativeCalls.sendInfo(this.id, {
      mimeType,
      body,
      headers: headers ?? null,
    });
  }

  public async startSendingVideo(stream: LocalVideoStream): Promise<void> {
    try {
      const result = await NativeCalls.startSendingVideo(this.id, stream.id);

      updateReadonlyWatchableValue(
        this.localVideoStreams,
        this.localVideoStreamRepository.getList(),
        watchableKey
      );

      return result;
    } catch (err) {
      throw toCallError(err);
    }
  }

  public async stopSendingVideo(): Promise<void> {
    try {
      const result = await NativeCalls.stopSendingVideo(this.id);

      updateReadonlyWatchableValue(
        this.localVideoStreams,
        this.localVideoStreamRepository.getList(),
        watchableKey
      );

      return result;
    } catch (err) {
      throw toCallError(err);
    }
  }

  private onEnded(): void {
    this.subscriptions.clear();
  }

  private bridgeNativeEvents(): void {
    this.subscriptions.add(
      NativeCalls.onConferenceConnected((p) => this.handleConnected(p)),

      NativeCalls.onConferenceDisconnected((p) => this.handleDisconnected(p)),

      NativeCalls.onConferenceFailed((p) => this.handleFailed(p)),

      NativeCalls.onConferenceReconnecting((payload) => {
        if (payload.conferenceId !== this.id) return;

        updateReadonlyWatchableValue(
          this.state,
          NativeCalls.getStateForConference(this.id),
          watchableKey
        );
      }),

      NativeCalls.onConferenceReconnected((payload) => {
        if (payload.conferenceId !== this.id) return;

        updateReadonlyWatchableValue(
          this.state,
          NativeCalls.getStateForConference(this.id),
          watchableKey
        );
      }),

      NativeCalls.onConferenceStatsReceived((payload) => {
        if (payload.conferenceId !== this.id) return;
        this.dispatchEvent({ name: ConferenceEvent.StatsReceived, payload });
      }),

      NativeCalls.onConferenceEndpointAdded((p) => this.handleEndpointAdded(p)),

      NativeCalls.onConferenceEndpointRemoved((p) =>
        this.handleEndpointRemoved(p)
      ),

      NativeCalls.onConferenceInfoReceived((payload) => {
        if (payload.conferenceId !== this.id) return;

        this.dispatchEvent({ name: ConferenceEvent.InfoReceived, payload });
      }),

      NativeCalls.onConferenceLocalVoiceActivityChanged((payload) => {
        if (payload.conferenceId !== this.id) return;

        updateReadonlyWatchableValue(
          this.isVoiceActivityDetected,
          payload.isVoiceActivityDetected,
          watchableKey
        );
      }),

      NativeCalls.onConferenceMessageReceived((payload) => {
        if (payload.conferenceId !== this.id) return;

        this.dispatchEvent({ name: ConferenceEvent.MessageReceived, payload });
      })
    );
  }

  private handleConnected(payload: ConferenceConnectedPayload): void {
    if (payload.conferenceId !== this.id) return;

    updateReadonlyWatchableValue(
      this.endpointId,
      NativeCalls.getEndpointIdForConference(this.id),
      watchableKey
    );

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getStateForConference(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: ConferenceEvent.Connected, payload });
  }

  private handleDisconnected(payload: ConferenceDisconnectedPayload): void {
    if (payload.conferenceId !== this.id) return;
    this.onEnded();

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getStateForConference(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: ConferenceEvent.Disconnected, payload });
  }

  private handleFailed(payload: ConferenceFailedPayload): void {
    if (payload.conferenceId !== this.id) return;
    this.onEnded();

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getStateForConference(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: ConferenceEvent.Failed, payload });
  }

  private handleEndpointAdded(payload: ConferenceEndpointAddedPayload): void {
    if (payload.conferenceId !== this.id) return;

    updateReadonlyWatchableValue(
      this.endpoints,
      this.endpointRepository.getList(),
      watchableKey
    );

    this.dispatchEvent({ name: ConferenceEvent.EndpointAdded, payload });
  }

  private handleEndpointRemoved(
    payload: ConferenceEndpointRemovedPayload
  ): void {
    if (payload.conferenceId !== this.id) return;

    updateReadonlyWatchableValue(
      this.endpoints,
      this.endpointRepository.getList(),
      watchableKey
    );

    this.dispatchEvent({ name: ConferenceEvent.EndpointRemoved, payload });
  }
}
