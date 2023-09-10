import { SettingMap } from 'api-server/models/settingMap';
import { LocalPackage } from 'api-server/packages/model/package';

export enum BrainCapability {
  CONVERSATION = 'conversation',
  VOICE_TRANSCRIPTION = 'voice_transcription',
  IMAGE_RECOGNITION = 'image_recognition',
}

export enum BrainSettingScope {
  //  Settings that apply to all instances of the app and can only be configured in user settings.
  // This is the default scope.
  APPLICATION = 'application',
  // Settings that can be configured in user settings and in the chat window.
  CHAT_OVERRIDABLE = 'chat_overridable',
}

export class LocalBrainSettingMap extends SettingMap {
  scope: BrainSettingScope;

  constructor(
    name: string,
    displayName: string,
    type: string,
    required?: boolean,
    defaultValue?: string,
    enumValues?: string[],
    description?: string,
    scope?: string
  ) {
    super(
      name,
      displayName,
      type,
      required,
      defaultValue,
      enumValues,
      description
    );
    this.scope = scope
      ? this.parseBrainSettingScope(scope)
      : BrainSettingScope.APPLICATION;
  }

  parseBrainSettingScope(scopeString: string): BrainSettingScope {
    switch (scopeString) {
      case 'application':
        return BrainSettingScope.APPLICATION;
      case 'chat_overridable':
        return BrainSettingScope.CHAT_OVERRIDABLE;
      default:
        throw new Error(`Invalid BrainSettingScope: ${scopeString}`);
    }
  }
}

export type LocalBrainModel = LocalPackage & {
  capabilities: BrainCapability[];
  settingsMap?: LocalBrainSettingMap[];
};
