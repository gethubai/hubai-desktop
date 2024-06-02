import { trackEvent } from '@aptabase/electron/renderer';
import {
  type ITelemetryData,
  type ITelemetryService,
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
    if (this.telemetryLevel >= TelemetryLevel.USAGE) trackEvent(event, data);
  }

  error(errorEventName: string, data?: ITelemetryData): void {
    if (this.telemetryLevel >= TelemetryLevel.CRASH)
      trackEvent(errorEventName, data);
  }
}
