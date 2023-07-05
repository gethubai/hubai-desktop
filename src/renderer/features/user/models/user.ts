export interface ILocalUser {
  id: string;
  name: string;
  defaultBrains: string[];
}

export class LocalUserModel implements ILocalUser {
  id: string = '';

  name: string = '';

  defaultBrains: string[] = [];

  constructor(id: string, name: string, defaultBrains: []) {
    this.id = id;
    this.name = name;
    this.defaultBrains = defaultBrains;
  }
}
