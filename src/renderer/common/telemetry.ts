export enum TelemetryLevel {
  NONE = 0,
  CRASH = 1,
  ERROR = 2,
  USAGE = 3,
}

export enum TelemetryEvents {
  APP_STARTED = 'app.started',
  APP_ERROR = 'app.error',
  APP_UNHANDLED_REJECTION = 'app.unhandled_rejection',
  // Auth
  AUTH_SIGN_IN = 'auth.sign_in',
  AUTH_SIGN_OUT = 'auth.sign_out',

  // ActivityBar
  ACTIVITY_BAR_CLICK = 'activity_bar.click',

  // Chat
  CHAT_CREATED = 'chat.created',

  // Package Store
  PACKAGE_STORE_PACKAGE_SELECTED = 'package_store.package_selected',

  // Packages
  PACKAGE_INSTALL = 'package.install',
  PACKAGE_UNINSTALL = 'package.uninstall',
}

export interface ITelemetryData {
  from?: string;
  target?: string;
  [key: string]: any;
}

export interface ITelemetryService {
  readonly telemetryLevel: TelemetryLevel;

  setLevel(level: TelemetryLevel): void;
  log(event: string, data?: ITelemetryData): void;
  error(errorEventName: string, data?: ITelemetryData): void;
}
