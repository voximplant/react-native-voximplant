import type { VideoStreamDTO } from '../../videoStream';
import { LocalVideoStreamImpl } from '../localVideoStream';
import type {
  LocalVideoSource,
  LocalVideoStream,
} from '../localVideoStream.types';

/**
 * @hidden
 */
export interface LocalVideoStreamDTO extends VideoStreamDTO {
  source: LocalVideoSource;
}

/**
 * @hidden
 */
export const localVideoStreamFromDTO = (
  dto: LocalVideoStreamDTO
): LocalVideoStream =>
  new LocalVideoStreamImpl({ id: dto.id, source: dto.source });

/**
 * @hidden
 */
export const localVideoStreamToDTO = (
  stream: LocalVideoStream
): LocalVideoStreamDTO => {
  return {
    id: stream.id,
    source: stream.source,
  };
};
