import type { AudioStream, AudioStreamId } from './audioStream.types';

/**
 * @hidden
 */
export abstract class AudioStreamImpl implements AudioStream {
  public readonly id: AudioStreamId;

  constructor(id: AudioStreamId) {
    this.id = id;
  }
}
