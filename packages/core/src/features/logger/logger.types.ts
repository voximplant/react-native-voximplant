/**
 * Enum that describes the log levels.
 *
 * @folder Logger
 */
export enum LogLevel {
  /**
   * Verbose, debug, info, warning, and error log messages are enabled.
   */
  Verbose = 'VERBOSE',
  /**
   * Debug, info, error, and warning log messages are enabled.
   */
  Debug = 'DEBUG',
  /**
   * Info, error, and warning log messages are enabled.
   */
  Info = 'INFO',
  /**
   * Error and warning log messages are enabled.
   */
  Warning = 'WARNING',
  /**
   * Only error messages are enabled.
   */
  Error = 'ERROR',
}

/**
 * Interface that represents the log data.
 *
 * @folder Logger
 */
export interface LogData {
  /**
   * Log message
   */
  message: string;
  /**
   * Log level
   */
  level: LogLevel;
}

/**
 * Interface that represents the logger callback configuration.
 *
 * @folder Logger
 */
export interface LoggerCallbackConfig {
  /**
   * Callback function that is called when a log message is received.
   */
  onLog: ((data: LogData) => void) | null;

  /**
   * Log level.
   */
  logLevel?: LogLevel;

  /**
   * Whether to include the timestamp in the log message.
   */
  timestamp?: boolean;

  /**
   * Thread id of the thread that logged the message
   *
   * @android
   */
  threadID?: boolean;
}

/**
 * Interface that represents the logger.
 *
 * @folder Logger
 */
export interface Logger {
  /**
   * Configures the logger callback.
   */
  configureCallback(config: LoggerCallbackConfig): void;

  /**
   * Enables or disables the logging to the logcat.
   *
   * @android
   */
  setLogcatEnabled(enabled: boolean): void;
}
