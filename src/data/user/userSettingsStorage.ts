export interface IUserSettingsStorage {
  get: (key: string) => any;
  getAll(): any;
  set: (value: any) => void;
  setSetting: (key: string, value: any) => void;
}
