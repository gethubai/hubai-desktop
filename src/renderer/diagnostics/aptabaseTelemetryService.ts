import { trackEvent } from '@aptabase/electron/renderer';
import {
  ITelemetryData,
  ITelemetryService,
  TelemetryLevel,
} from 'renderer/common/telemetry';

export class AptaBaseTelemetryService implements ITelemetryService {
  private _telemetryLevel: TelemetryLevel | undefined;

  get telemetryLevel(): TelemetryLevel {
    return this._telemetryLevel ?? TelemetryLevel.NONE;
  }

  setLevel(level: TelemetryLevel): void {
    if (this._telemetryLevel === undefined) {
      this._telemetryLevel = level;
    }
  }

  log(event: string, data?: ITelemetryData): void {
    if (this._telemetryLevel !== TelemetryLevel.USAGE) {
      return;
    }

    trackEvent(event, data);
  }

  error(errorEventName: string, data?: ITelemetryData): void {
    if (this._telemetryLevel === TelemetryLevel.NONE) {
      return;
    }

    trackEvent(errorEventName, data);
  }
}
