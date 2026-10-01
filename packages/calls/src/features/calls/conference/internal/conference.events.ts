import type { BaseConferenceEventPayload } from '../conference.events';

/**
 * @hidden
 */
export interface ConferenceLocalVoiceActivityChangedInternalPayload
  extends BaseConferenceEventPayload {
  isVoiceActivityDetected: boolean;
}
