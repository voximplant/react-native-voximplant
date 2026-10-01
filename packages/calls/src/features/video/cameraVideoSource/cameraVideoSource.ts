import {
  createEventBus,
  createReadonlyWatchable,
  generateUUID,
  updateReadonlyWatchableValue,
  type AddEventListener,
  type DispatchEvent,
  type ListenerOptions,
  type ReadonlyWatchable,
  type RemoveEventListener,
} from '@voximplant/react-native-shared';
import NativeVideo from '../../../specs/video.native-spec';
import { type CameraDevice, type CameraResolution } from '../cameraDevice';
import { CameraDeviceRepository } from '../cameraDevice/internal';
import type { QualityPreset } from '../video.types';
import {
  preferredResolutionFromDTO,
  preferredResolutionToDTO,
} from './internal/cameraVideoSource.dto';
import {
  CameraVideoSourceEvent,
  type AnyCameraVideoSourceEvent,
} from './cameraVideoSource.events';
import { toCameraVideoSourceError } from './cameraVideoSource.mappers';

/**
 * Camera video source for managing camera devices and preferred resolution.
 *
 * @folder Video
 * @hideconstructor
 */
export abstract class CameraVideoSource {
  private static instance: CameraVideoSource | null = null;

  /**
   * Returns the instance of the camera video source.
   */
  public static getInstance(): CameraVideoSource {
    if (!CameraVideoSource.instance) {
      CameraVideoSource.instance = new CameraVideoSourceImpl();
    }
    return CameraVideoSource.instance;
  }

  protected constructor() {}

  /**
   * List of camera devices available on the device.
   */
  abstract readonly devices: CameraDevice[];

  /**
   * Watchable property that allows getting the selected [Calls.Video.CameraDevice] and observing its changes.
   */
  abstract readonly selectedDevice: ReadonlyWatchable<CameraDevice | null>;

  /**
   * Watchable property that allows getting the preferred camera resolution and observing its changes.
   *
   * The value can be:
   * - [Calls.Video.CameraResolution] with explicit width and height
   * - [Calls.Video.QualityPreset] when set via [Calls.Video.CameraVideoSource.setPreferredResolution]
   *
   * For [Calls.Video.QualityPreset], the SDK selects the closest resolution supported by the selected camera device.
   * See [Calls.Video.CameraDevice.supportedResolutions] for available resolutions.
   */
  abstract readonly preferredResolution: ReadonlyWatchable<
    CameraResolution | QualityPreset
  >;

  /**
   * Changes the [Calls.Video.CameraVideoSource.selectedDevice] to the provided one.
   *
   * @param device Camera device to select
   * @throws
   * - [Calls.Video.CameraVideoSourceErrors.CameraVideoSourceCameraNotFoundError] If the camera is not found
   * - [Calls.Video.CameraVideoSourceErrors.CameraVideoSourcePermissionRequiredError] If camera permission is not granted
   * - [Calls.Video.CameraVideoSourceErrors.CameraVideoSourceCameraError] If the camera fails to start or is already in use
   * - [Calls.Video.CameraVideoSourceErrors.CameraVideoSourceInterruptedError] If camera capture is interrupted
   */
  abstract selectDevice(device: CameraDevice): Promise<void>;

  /**
   * Sets the preferred camera resolution.
   *
   * Supported values:
   * - [Calls.Video.CameraResolution] for custom width and height
   * - [Calls.Video.QualityPreset] for predefined quality level
   *
   * The closest resolution supported by the selected camera device is chosen.
   * Updates [Calls.Video.CameraVideoSource.preferredResolution].
   *
   * @param resolution Preferred resolution for camera
   */
  abstract setPreferredResolution(
    resolution: CameraResolution | QualityPreset
  ): void;

  /**
   * @reinterpret Calls.DocCameraVideoSourceAddEventListener
   */
  abstract addEventListener: AddEventListener<AnyCameraVideoSourceEvent>;

  /**
   * @reinterpret Calls.DocCameraVideoSourceRemoveEventListener
   */
  abstract removeEventListener: RemoveEventListener<AnyCameraVideoSourceEvent>;
}

const watchableKey = generateUUID();

/**
 * @hidden
 */
class CameraVideoSourceImpl extends CameraVideoSource {
  public readonly selectedDevice: ReadonlyWatchable<CameraDevice | null>;
  public readonly preferredResolution: ReadonlyWatchable<
    CameraResolution | QualityPreset
  >;

  public addEventListener: AddEventListener<AnyCameraVideoSourceEvent>;
  public removeEventListener: RemoveEventListener<AnyCameraVideoSourceEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyCameraVideoSourceEvent>;

  private readonly repository: CameraDeviceRepository;

  constructor() {
    super();

    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyCameraVideoSourceEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.repository = new CameraDeviceRepository(NativeVideo);

    this.selectedDevice = createReadonlyWatchable(
      this.repository.getSelectedDevice(),
      watchableKey
    );

    this.preferredResolution = createReadonlyWatchable(
      preferredResolutionFromDTO(NativeVideo.getPreferredResolution()),
      watchableKey
    );
    this.bridgeNativeEvents();
  }

  public get devices(): CameraDevice[] {
    return this.repository.getList();
  }

  public async selectDevice(device: CameraDevice): Promise<void> {
    try {
      const resolved = await this.repository.selectDevice(device);

      updateReadonlyWatchableValue(this.selectedDevice, resolved, watchableKey);
    } catch (err) {
      throw toCameraVideoSourceError(err);
    }
  }

  public setPreferredResolution(
    preference: CameraResolution | QualityPreset
  ): void {
    NativeVideo.setPreferredResolution(preferredResolutionToDTO(preference));

    updateReadonlyWatchableValue(
      this.preferredResolution,
      preference,
      watchableKey
    );
  }

  private bridgeNativeEvents(): void {
    NativeVideo.onStarted(() => {
      this.dispatchEvent({
        name: CameraVideoSourceEvent.Started,
      });
    });

    NativeVideo.onStopped((reason) => {
      this.dispatchEvent({
        name: CameraVideoSourceEvent.Stopped,
        payload: {
          reason,
        },
      });
    });

    NativeVideo.onFailed(({ code, message }) => {
      this.dispatchEvent({
        name: CameraVideoSourceEvent.Failed,
        payload: {
          code,
          message,
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
export type DocCameraVideoSourceAddEventListener = (
  /**
   * Event name
   */
  eventName: CameraVideoSourceEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyCameraVideoSourceEvent) => void | Promise<void>,
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
export type DocCameraVideoSourceRemoveEventListener = (
  /**
   * Event name
   */
  eventName: CameraVideoSourceEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyCameraVideoSourceEvent) => void | Promise<void>
) => void;
