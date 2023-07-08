import SettingsMapForm from 'renderer/components/form/settingsMapForm';
import { IExtensionListController } from '../controllers/type';
import {
  IExtensionListState,
  LocalExtensionViewModel,
} from '../models/extension';

export interface ILocalExtensionWindowProps
  extends IExtensionListController,
    IExtensionListState {
  extension: LocalExtensionViewModel;
  getCurrentSettings: () => any;
}

function LocalExtensionWindow({
  extension,
  getCurrentSettings,
  onSaveSettings,
}: ILocalExtensionWindowProps) {
  const settingsMap = extension?.contributes?.configuration || [];

  const showSettings = !!settingsMap && settingsMap.length > 0;

  const currentSettings = getCurrentSettings();

  const onSubmit = (formData: any) => {
    onSaveSettings?.(extension, formData);
  };

  return (
    <div style={{ marginTop: -20, marginLeft: 10 }}>
      <div id="content_container">
        <h2>{extension.displayName}</h2>
        <span style={{ fontSize: 16 }}>{extension.description}</span>
      </div>

      {showSettings && (
        <div id="settings_container" style={{ marginTop: 20 }}>
          <SettingsMapForm
            settingsMap={settingsMap}
            currentSettings={currentSettings}
            onSubmit={onSubmit}
          >
            <div>
              <button type="submit">Save Settings</button>
            </div>
          </SettingsMapForm>
        </div>
      )}
    </div>
  );
}
export default LocalExtensionWindow;
