import { type VideoStreamId } from '../../../video';
import type { ConferenceSettings } from '../conference.types';

/**
 * @hidden
 */
export type ConferenceSettingsDTO = Omit<
  ConferenceSettings,
  'localVideoStream'
> & {
  localVideoStream?: VideoStreamId;
};

/**
 * @hidden
 */
export const conferenceSettingsToDTO = (
  settings: ConferenceSettings
): ConferenceSettingsDTO => {
  return {
    ...settings,
    localVideoStream: settings.localVideoStream?.id,
  };
};
