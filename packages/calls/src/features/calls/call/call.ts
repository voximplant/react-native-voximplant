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
import { type LocalVideoStream, type RemoteVideoStream } from '../../video';
import { toCallError } from '../calls.mappers';
import { CallsLocalVideoStreamRepository } from '../internal';
import {
  CallEvent,
  type AnyCallEvent,
  type CallConnectedPayload,
  type CallDisconnectedPayload,
  type CallFailedPayload,
} from './call.events';
import {
  CallState,
  type Call,
  type CallDirection,
  type CallId,
  type CallSettings,
  type RejectMode,
} from './call.types';
import {
  CallRemoteVideoStreamRepository,
  type CallRemoteVideoStreamAddedInternalPayload,
  type CallRemoteVideoStreamRemovedInternalPayload,
} from './internal';
import { callSettingsToDTO } from './internal/call.dto';

const watchableKey = generateUUID();

/**
 * @hidden
 */
export interface CallData {
  readonly id: CallId;
}

/**
 * @hidden
 */
export class CallImpl implements Call {
  public readonly id: CallId;

  public readonly state: ReadonlyWatchable<CallState>;
  public readonly isMuted: ReadonlyWatchable<boolean>;
  public readonly isOnHold: ReadonlyWatchable<boolean>;
  public readonly localVideoStreams: ReadonlyWatchable<LocalVideoStream[]>;
  public readonly remoteVideoStreams: ReadonlyWatchable<RemoteVideoStream[]>;
  public readonly remoteDisplayName: ReadonlyWatchable<string | null>;
  public readonly remoteUsername: ReadonlyWatchable<string | null>;

  public addEventListener: AddEventListener<AnyCallEvent>;
  public removeEventListener: RemoveEventListener<AnyCallEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyCallEvent>;

  private readonly localVideoStreamRepository: CallsLocalVideoStreamRepository;
  private readonly remoteVideoStreamRepository: CallRemoteVideoStreamRepository;
  private readonly subscriptions: SubscriptionStore;

  constructor(data: CallData) {
    this.id = data.id;

    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyCallEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.subscriptions = new SubscriptionStore();

    this.localVideoStreamRepository = new CallsLocalVideoStreamRepository({
      callId: this.id,
      native: NativeCalls,
    });

    this.remoteVideoStreamRepository = new CallRemoteVideoStreamRepository({
      callId: this.id,
      native: NativeCalls,
    });

    this.state = createReadonlyWatchable(
      NativeCalls.getCallState(this.id),
      watchableKey
    );

    this.isMuted = createReadonlyWatchable(
      NativeCalls.getIsMuted(this.id),
      watchableKey
    );

    this.isOnHold = createReadonlyWatchable(
      NativeCalls.getIsOnHold(this.id),
      watchableKey
    );

    this.localVideoStreams = createReadonlyWatchable(
      this.localVideoStreamRepository.getList(),
      watchableKey
    );

    this.remoteVideoStreams = createReadonlyWatchable(
      this.remoteVideoStreamRepository.getList(),
      watchableKey
    );

    this.remoteDisplayName = createReadonlyWatchable(
      NativeCalls.getRemoteDisplayName(this.id),
      watchableKey
    );

    this.remoteUsername = createReadonlyWatchable(
      NativeCalls.getRemoteUsername(this.id),
      watchableKey
    );

    this.bridgeNativeEvents();
  }

  public get direction(): CallDirection {
    return NativeCalls.getCallDirection(this.id);
  }

  public get duration(): number {
    return NativeCalls.getDuration(this.id);
  }

  public start(): void {
    try {
      return NativeCalls.start(this.id);
    } catch (err) {
      throw toCallError(err);
    }
  }

  public answer(settings?: CallSettings): void {
    try {
      const settingsToUse = settings ? callSettingsToDTO(settings) : null;
      return NativeCalls.answer(this.id, settingsToUse);
    } catch (err) {
      throw toCallError(err);
    }
  }

  public hangup(headers?: ExtraHeaders): void {
    return NativeCalls.hangup(this.id, headers || null);
  }

  public reject(mode: RejectMode, headers?: ExtraHeaders): void {
    try {
      return NativeCalls.reject(this.id, mode, headers || null);
    } catch (err) {
      throw toCallError(err);
    }
  }

  public mute(value: boolean): void {
    NativeCalls.mute(this.id, value);

    updateReadonlyWatchableValue(this.isMuted, value, watchableKey);
  }

  public sendDTMF(tones: string): void {
    return NativeCalls.sendDTMF(this.id, tones);
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
      headers: headers || null,
    });
  }

  public async hold(enable: boolean): Promise<void> {
    try {
      await NativeCalls.hold(this.id, enable);

      updateReadonlyWatchableValue(
        this.isOnHold,
        NativeCalls.getIsOnHold(this.id),
        watchableKey
      );
    } catch (err) {
      throw toCallError(err);
    }
  }

  public async startSendingVideo(stream: LocalVideoStream): Promise<void> {
    try {
      await NativeCalls.startSendingVideo(this.id, stream.id);

      updateReadonlyWatchableValue(
        this.localVideoStreams,
        this.localVideoStreamRepository.getList(),
        watchableKey
      );
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
      NativeCalls.onCallConnected((p) => this.handleConnected(p)),

      NativeCalls.onCallDisconnected((p) => this.handleDisconnected(p)),

      NativeCalls.onCallFailed((p) => this.handleFailed(p)),

      NativeCalls.onCallReconnecting((payload) => {
        if (payload.callId !== this.id) return;

        updateReadonlyWatchableValue(
          this.state,
          NativeCalls.getCallState(this.id),
          watchableKey
        );
      }),

      NativeCalls.onCallReconnected((payload) => {
        if (payload.callId !== this.id) return;

        updateReadonlyWatchableValue(
          this.state,
          NativeCalls.getCallState(this.id),
          watchableKey
        );
      }),

      NativeCalls.onCallStartRinging((payload) => {
        if (payload.callId !== this.id) return;
        this.dispatchEvent({ name: CallEvent.StartRinging, payload });
      }),

      NativeCalls.onCallStopRinging((payload) => {
        if (payload.callId !== this.id) return;
        this.dispatchEvent({ name: CallEvent.StopRinging, payload });
      }),

      NativeCalls.onCallMessageReceived((payload) => {
        if (payload.callId !== this.id) return;
        this.dispatchEvent({ name: CallEvent.MessageReceived, payload });
      }),

      NativeCalls.onCallInfoReceived((payload) => {
        if (payload.callId !== this.id) return;
        this.dispatchEvent({ name: CallEvent.InfoReceived, payload });
      }),

      NativeCalls.onCallStatsReceived((payload) => {
        if (payload.callId !== this.id) return;
        this.dispatchEvent({ name: CallEvent.StatsReceived, payload });
      }),

      NativeCalls.onCallRemoteVideoStreamAdded((p) =>
        this.handleRemoteVideoStreamAdded(p)
      ),

      NativeCalls.onCallRemoteVideoStreamRemoved((p) =>
        this.handleRemoteVideoStreamRemoved(p)
      )
    );
  }

  private handleConnected(payload: CallConnectedPayload): void {
    if (payload.callId !== this.id) return;

    updateReadonlyWatchableValue(
      this.remoteDisplayName,
      NativeCalls.getRemoteDisplayName(this.id),
      watchableKey
    );

    updateReadonlyWatchableValue(
      this.remoteUsername,
      NativeCalls.getRemoteUsername(this.id),
      watchableKey
    );

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getCallState(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: CallEvent.Connected, payload });
  }

  private handleDisconnected(payload: CallDisconnectedPayload): void {
    if (payload.callId !== this.id) return;
    this.onEnded();

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getCallState(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: CallEvent.Disconnected, payload });
  }

  private handleFailed(payload: CallFailedPayload): void {
    if (payload.callId !== this.id) return;
    this.onEnded();

    updateReadonlyWatchableValue(
      this.state,
      NativeCalls.getCallState(this.id),
      watchableKey
    );

    this.dispatchEvent({ name: CallEvent.Failed, payload });
  }

  private handleRemoteVideoStreamAdded(
    payload: CallRemoteVideoStreamAddedInternalPayload
  ): void {
    if (payload.callId !== this.id) return;

    updateReadonlyWatchableValue(
      this.remoteVideoStreams,
      this.remoteVideoStreamRepository.getList(),
      watchableKey
    );

    const stream = this.remoteVideoStreamRepository.get(payload.streamId);
    if (!stream) return;

    this.dispatchEvent({
      name: CallEvent.RemoteVideoStreamAdded,
      payload: {
        callId: payload.callId,
        stream,
      },
    });
  }

  private handleRemoteVideoStreamRemoved(
    payload: CallRemoteVideoStreamRemovedInternalPayload
  ): void {
    if (payload.callId !== this.id) return;

    const stream = this.remoteVideoStreamRepository.remove(payload.streamId);

    updateReadonlyWatchableValue(
      this.remoteVideoStreams,
      this.remoteVideoStreamRepository.getList(),
      watchableKey
    );
    if (!stream) return;

    this.dispatchEvent({
      name: CallEvent.RemoteVideoStreamRemoved,
      payload: {
        callId: payload.callId,
        stream,
      },
    });
  }
}
