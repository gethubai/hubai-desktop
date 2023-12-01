export class SettingMap {
  name: string;

  displayName: string;

  type: string;

  enumValues?: string[];

  defaultValue?: string;

  required: boolean;

  description?: string;

  isSecret?: boolean;

  constructor(
    name: string,
    displayName: string,
    type: string,
    required?: boolean,
    defaultValue?: string,
    enumValues?: string[],
    description?: string,
    isSecret?: boolean
  ) {
    this.name = name;
    this.displayName = displayName;
    this.type = this.parseSettingType(type);
    this.defaultValue = defaultValue;
    this.enumValues = enumValues;
    this.required = required === undefined ? false : required;
    this.description = description;
    this.isSecret = isSecret;

    // TODO: Apply validation:
    // If the type is enum, the enumValues must be set
    // If the type is not enum, the enumValues must not be set
    // If the type is number or integer, the defaultValue must be a number
    // If the type is boolean, the defaultValue must be a boolean
    // Name and title are required
  }

  parseSettingType(typeString: string): string {
    if (!['string', 'number', 'boolean', 'integer'].includes(typeString)) {
      throw new Error(`Invalid SettingType: ${typeString}`);
    }

    return typeString;
  }
}
