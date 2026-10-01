import { AudioStreamImpl, type AudioStreamId } from '../audioStream';
import type { RemoteAudioStream } from './remoteAudioStream.types';

/**
 * @hidden
 */
export interface RemoteAudioStreamData {
  readonly id: AudioStreamId;
}

/**
 * @hidden
 */
export class RemoteAudioStreamImpl
  extends AudioStreamImpl
  implements RemoteAudioStream
{
  constructor(data: RemoteAudioStreamData) {
    super(data.id);
  }
}
