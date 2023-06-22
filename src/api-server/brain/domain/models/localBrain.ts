export enum BrainCapability {
  CONVERSATION = 'conversation',
  VOICE_TRANSCRIPTION = 'voice_transcription',
  IMAGE_RECOGNITION = 'image_recognition',
}

export enum BrainSettingType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
}

export enum BrainSettingScope {
  //  Settings that apply to all instances of the app and can only be configured in user settings.
  // This is the default scope.
  APPLICATION = 'application',
  // Settings that can be configured in user settings and in the chat window.
  CHAT_OVERRIDABLE = 'chat_overridable',
}

export class LocalBrainSettingMap {
  name: string;

  title: string;

  type: BrainSettingType;

  enumValues?: string[];

  defaultValue?: string;

  required: boolean;

  description?: string;

  scope: BrainSettingScope;

  constructor(
    name: string,
    title: string,
    type: string,
    required?: boolean,
    defaultValue?: string,
    enumValues?: string[],
    description?: string,
    scope?: string
  ) {
    this.name = name;
    this.title = title;
    this.type = this.parseBrainSettingType(type);
    this.defaultValue = defaultValue;
    this.enumValues = enumValues;
    this.required = required === undefined ? false : required;
    this.description = description;
    this.scope = scope
      ? this.parseBrainSettingScope(scope)
      : BrainSettingScope.APPLICATION;
    // TODO: Apply validation:
    // If the type is enum, the enumValues must be set
    // If the type is not enum, the enumValues must not be set
    // If the type is number or integer, the defaultValue must be a number
    // If the type is boolean, the defaultValue must be a boolean
    // Name and title are required
  }

  parseBrainSettingType(typeString: string): BrainSettingType {
    switch (typeString) {
      case 'string':
        return BrainSettingType.STRING;
      case 'number':
        return BrainSettingType.NUMBER;
      case 'boolean':
        return BrainSettingType.BOOLEAN;
      case 'integer':
        return BrainSettingType.INTEGER;
      default:
        throw new Error(`Invalid BrainSettingType: ${typeString}`);
    }
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

export type LocalBrainModel = {
  id: string;
  name: string;
  title: string;
  description?: string;
  capabilities: BrainCapability[];
  settingsMap?: LocalBrainSettingMap[];
  createdDate: Date | string;
};
