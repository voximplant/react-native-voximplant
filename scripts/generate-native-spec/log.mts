import { CONFIG } from './config.mts';
import type { Log } from './types.mts';

export const log: Log = {
  debug: (...args) => CONFIG.DEBUG && console.log(...args),
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
};
