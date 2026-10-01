import type { ExtraHeaders } from '@voximplant/react-native-shared';

/**
 * @hidden
 */
export interface SendInfoParams {
  mimeType: string;
  body: string;
  headers: ExtraHeaders | null;
}
