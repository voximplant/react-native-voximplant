import NativeCore from '../../specs/core.native-spec';
import { LoggerImpl, type Logger } from '../logger';

/**
 * Core for managing the connection to the Voximplant cloud.
 * @hideconstructor
 */
export abstract class Core {
  private static instance: Core | null = null;

  /**
   * Returns the instance of the core.
   */
  public static getInstance(): Core {
    if (!Core.instance) {
      Core.instance = new CoreImpl();
    }
    return Core.instance;
  }

  protected constructor() {}

  /**
   * Logger for logging messages.
   */
  abstract readonly logger: Logger;

  /**
   * Initializes the core.
   */
  abstract initialize(): void;
}

/**
 * @hidden
 */
class CoreImpl extends Core {
  public readonly logger: Logger;

  constructor() {
    super();

    this.logger = new LoggerImpl();
  }

  public initialize(): void {
    return NativeCore.initialize();
  }
}
