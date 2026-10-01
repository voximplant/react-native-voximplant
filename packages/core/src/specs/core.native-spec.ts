import {
  resolveNativeModule,
  withLegacyEvents,
} from '@voximplant/react-native-shared';
import { type CodegenTypes, type TurboModule } from 'react-native';
import type { ClientDisconnectReason, ClientState } from '../features/client';
import type { ConnectOptions } from '../features/connection';
import type { LogData, LoggerCallbackConfigDTO } from '../features/logger';
import type { LoginResult, LoginTokens } from '../features/login';
import type { PushConfig, PushPayload } from '../features/push';

const MODULE_NAME = 'RNVICore';

export interface Spec extends TurboModule {
  // ---- Core ----
  initialize: () => void;
  // ---- /Core ----

  // ---- Client ----
  getClientState(): ClientState;

  connect: (options: ConnectOptions) => Promise<void>;
  disconnect: () => Promise<void>;

  login: (username: string, password: string) => Promise<LoginResult>;
  loginWithOneTimeKey: (username: string, hash: string) => Promise<LoginResult>;
  loginWithAccessToken: (
    username: string,
    accessToken: string
  ) => Promise<LoginResult>;

  requestOneTimeKey: (username: string) => Promise<string>;
  refreshTokens: (
    username: string,
    refreshToken: string
  ) => Promise<LoginTokens>;

  handlePushNotification: (pushPayload: PushPayload) => void;
  registerForPushNotifications: (config: PushConfig) => Promise<void>;
  unregisterFromPushNotifications: (config: PushConfig) => Promise<void>;

  readonly onClientDisconnected: CodegenTypes.EventEmitter<ClientDisconnectReason>;
  readonly onClientReconnecting: CodegenTypes.EventEmitter<void>;
  readonly onClientReconnected: CodegenTypes.EventEmitter<void>;
  // ---- /Client ----

  // ---- Logger ----
  configureLoggerCallback: (config: LoggerCallbackConfigDTO) => void;
  setLogcatEnabled: (enabled: boolean) => void;
  readonly onLog: CodegenTypes.EventEmitter<LogData>;
  // ---- /Logger ----
}

const resolved = resolveNativeModule<Spec>(MODULE_NAME);
const NativeCore = withLegacyEvents<Spec>(MODULE_NAME, resolved);

export default NativeCore;
