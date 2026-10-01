import { type VideoStreamId } from '../../../video';
import type { CallSettings } from '../call.types';

/**
 * @hidden
 */
export type CallSettingsDTO = Omit<CallSettings, 'localVideoStream'> & {
  localVideoStream?: VideoStreamId;
};

/**
 * @hidden
 */
export const callSettingsToDTO = (settings: CallSettings): CallSettingsDTO => {
  return {
    ...settings,
    localVideoStream: settings.localVideoStream?.id,
  };
};
