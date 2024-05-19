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
    if (!name || name.length < 1) {
      throw new Error('Name is required');
    }

    if (!displayName || displayName.length < 1) {
      throw new Error('Display Name is required');
    }

    this.name = name;
    this.displayName = displayName;
    this.type = this.parseSettingType(type);
    this.enumValues = [];
    this.required = required === undefined ? false : required;
    this.description = description;
    this.isSecret = isSecret;

    switch (this.type) {
      case 'boolean':
        if (typeof defaultValue !== 'boolean') {
          throw new Error(
            `Invalid default value for boolean setting: ${this.name}`
          );
        }
        break;
      case 'number':
      case 'integer':
        if (typeof defaultValue !== 'number') {
          throw new Error(
            `Invalid default value for number setting: ${this.name}`
          );
        }
        break;
      case 'enum':
        if (!Array.isArray(enumValues) || enumValues.length === 0) {
          throw new Error(`Invalid enumValues for enum setting: ${this.name}`);
        }
        this.enumValues = enumValues;
        break;
      default:
        break;
    }

    this.defaultValue = defaultValue;
  }

  parseSettingType(typeString: string): string {
    if (!['string', 'number', 'boolean', 'integer'].includes(typeString)) {
      throw new Error(`Invalid SettingType: ${typeString}`);
    }

    return typeString;
  }
}
