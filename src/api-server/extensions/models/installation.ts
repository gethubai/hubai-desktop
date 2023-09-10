import { LocalExtensionModel } from '../domain/models/localExtension';

export type ExtensionInstallationResult = {
  success: boolean;
  error?: Error;
  extension?: LocalExtensionModel;
};

export type ExtensionUninstallationResult = {
  success: boolean;
  error?: Error;
};
