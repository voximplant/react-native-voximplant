import {
  createEventBus,
  createReadonlyWatchable,
  generateUUID,
  SubscriptionStore,
  updateReadonlyWatchableValue,
  type AddEventListener,
  type DispatchEvent,
  type ReadonlyWatchable,
  type RemoveEventListener,
} from '@voximplant/react-native-shared';
import NativeCalls from '../../../../specs/calls.native-spec';
import { type RemoteAudioStream } from '../../../audio';
import {
  type RemoteVideoStream,
  type VideoResolution,
  type VideoStreamId,
} from '../../../video';
import { toCallError } from '../../calls.mappers';
import { EndpointEvent, type AnyEndpointEvent } from './endpoint.events';
import type { Endpoint, EndpointId } from './endpoint.types';
import {
  EndpointAudioStreamRepository,
  EndpointVideoStreamRepository,
  type EndpointRemoteVideoStreamAddedInternalPayload,
  type EndpointRemoteVideoStreamRemovedInternalPayload,
} from './internal';

const watchableKey = generateUUID();

/**
 * @hidden
 */
export interface EndpointData {
  readonly id: EndpointId;
}

/**
 * @hidden
 */
export class EndpointImpl implements Endpoint {
  readonly id: string;

  public readonly isMuted: ReadonlyWatchable<boolean>;
  public readonly isVoiceActivityDetected: ReadonlyWatchable<boolean>;
  public readonly audioStreams: ReadonlyWatchable<readonly RemoteAudioStream[]>;
  public readonly videoStreams: ReadonlyWatchable<readonly RemoteVideoStream[]>;

  public addEventListener: AddEventListener<AnyEndpointEvent>;
  public removeEventListener: RemoveEventListener<AnyEndpointEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyEndpointEvent>;

  private readonly audioStreamRepository: EndpointAudioStreamRepository;
  private readonly videoStreamRepository: EndpointVideoStreamRepository;
  private readonly subscriptions: SubscriptionStore;

  constructor(data: EndpointData) {
    this.id = data.id;

    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyEndpointEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.subscriptions = new SubscriptionStore();

    this.audioStreamRepository = new EndpointAudioStreamRepository({
      endpointId: this.id,
      native: NativeCalls,
    });

    this.videoStreamRepository = new EndpointVideoStreamRepository({
      endpointId: this.id,
      native: NativeCalls,
    });

    this.isMuted = createReadonlyWatchable(
      NativeCalls.getIsMutedForEndpoint(this.id),
      watchableKey
    );

    this.isVoiceActivityDetected = createReadonlyWatchable(
      NativeCalls.getIsVoiceActivityDetectedForEndpoint(this.id),
      watchableKey
    );

    this.audioStreams = createReadonlyWatchable(
      this.audioStreamRepository.getList(),
      watchableKey
    );

    this.videoStreams = createReadonlyWatchable(
      this.videoStreamRepository.getList(),
      watchableKey
    );

    this.bridgeNativeEvents();
  }

  public get displayName(): string | null {
    return NativeCalls.getDisplayNameForEndpoint(this.id);
  }

  public get username(): string | null {
    return NativeCalls.getUsernameForEndpoint(this.id);
  }

  public get sipUri(): string | null {
    return NativeCalls.getSipUriForEndpoint(this.id);
  }

  public startReceivingVideo(streamId: VideoStreamId): void {
    return NativeCalls.startReceivingVideoForEndpoint(this.id, streamId);
  }

  public stopReceivingVideo(streamId: VideoStreamId): void {
    return NativeCalls.stopReceivingVideoForEndpoint(this.id, streamId);
  }

  public async requestVideoSize(
    streamId: VideoStreamId,
    size: VideoResolution
  ): Promise<void> {
    try {
      await NativeCalls.requestVideoSizeForEndpoint(this.id, streamId, size);
    } catch (err) {
      throw toCallError(err);
    }
  }

  private onRemoved(): void {
    this.subscriptions.clear();
  }

  private bridgeNativeEvents(): void {
    this.subscriptions.add(
      NativeCalls.onConferenceEndpointRemoved((payload) => {
        if (payload.endpointId !== this.id) return;
        this.onRemoved();
      }),

      NativeCalls.onEndpointMuteStateChanged((payload) => {
        if (payload.endpointId !== this.id) return;

        updateReadonlyWatchableValue(
          this.isMuted,
          payload.isMuted,
          watchableKey
        );
      }),

      NativeCalls.onEndpointVoiceActivityChanged((payload) => {
        if (payload.endpointId !== this.id) return;

        updateReadonlyWatchableValue(
          this.isVoiceActivityDetected,
          payload.isVoiceActivityDetected,
          watchableKey
        );
      }),

      NativeCalls.onEndpointRemoteVideoStreamAdded((p) =>
        this.handleRemoteVideoStreamAdded(p)
      ),

      NativeCalls.onEndpointRemoteVideoStreamRemoved((p) =>
        this.handleRemoteVideoStreamRemoved(p)
      ),

      NativeCalls.onEndpointStartReceivingVideoStream((payload) => {
        if (payload.endpointId !== this.id) return;

        this.dispatchEvent({
          name: EndpointEvent.StartReceivingVideoStream,
          payload: {
            endpointId: payload.endpointId,
            streamId: payload.streamId,
          },
        });
      }),

      NativeCalls.onEndpointStopReceivingVideoStream((payload) => {
        if (payload.endpointId !== this.id) return;

        this.dispatchEvent({
          name: EndpointEvent.StopReceivingVideoStream,
          payload: {
            endpointId: payload.endpointId,
            streamId: payload.streamId,
            reason: payload.reason,
          },
        });
      })
    );
  }

  private handleRemoteVideoStreamAdded(
    payload: EndpointRemoteVideoStreamAddedInternalPayload
  ): void {
    if (payload.endpointId !== this.id) return;

    updateReadonlyWatchableValue(
      this.videoStreams,
      this.videoStreamRepository.getList(),
      watchableKey
    );

    const stream = this.videoStreamRepository.get(payload.streamId);
    if (!stream) return;

    this.dispatchEvent({
      name: EndpointEvent.RemoteVideoStreamAdded,
      payload: {
        endpointId: payload.endpointId,
        stream,
      },
    });
  }

  private handleRemoteVideoStreamRemoved(
    payload: EndpointRemoteVideoStreamRemovedInternalPayload
  ): void {
    if (payload.endpointId !== this.id) return;

    const stream = this.videoStreamRepository.remove(payload.streamId);

    updateReadonlyWatchableValue(
      this.videoStreams,
      this.videoStreamRepository.getList(),
      watchableKey
    );
    if (!stream) return;

    this.dispatchEvent({
      name: EndpointEvent.RemoteVideoStreamRemoved,
      payload: {
        endpointId: payload.endpointId,
        stream,
      },
    });
  }
}
