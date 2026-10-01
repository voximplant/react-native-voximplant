import type { LoggerCallbackConfig } from '../logger.types';

/**
 * @hidden
 */
export type LoggerCallbackConfigDTO = Omit<LoggerCallbackConfig, 'onLog'>;

/**
 * @hidden
 */
export const loggerCallbackConfigToDTO = (
  config: LoggerCallbackConfig
): LoggerCallbackConfigDTO => {
  const dto: LoggerCallbackConfigDTO = {};

  if (config.logLevel !== undefined) dto.logLevel = config.logLevel;
  if (config.threadID !== undefined) dto.threadID = config.threadID;
  if (config.timestamp !== undefined) dto.timestamp = config.timestamp;

  return dto;
};
