import type { EventSubscription } from 'react-native';
import NativeCore from '../../specs/core.native-spec';
import { loggerCallbackConfigToDTO } from './internal/logger.dto';
import type { Logger, LoggerCallbackConfig } from './logger.types';

/**
 * @hidden
 */
export class LoggerImpl implements Logger {
  private logSubscription: EventSubscription | null = null;

  public setLogcatEnabled(enabled: boolean): void {
    NativeCore.setLogcatEnabled(enabled);
  }

  public configureCallback(config: LoggerCallbackConfig): void {
    this.logSubscription?.remove();

    if (!config.onLog) {
      return;
    }

    this.logSubscription = NativeCore.onLog((data) => config.onLog?.(data));
    NativeCore.configureLoggerCallback(loggerCallbackConfigToDTO(config));
  }
}
