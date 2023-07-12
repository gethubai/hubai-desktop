import SettingsMapForm from 'renderer/components/form/settingsMapForm';
import { IBrainController } from '../controllers/type';
import { IBrainState, LocalBrainViewModel } from '../models/brain';

export interface ILocalBrainWindowProps extends IBrainController, IBrainState {
  brain: LocalBrainViewModel;
  getCurrentSettings: () => any;
}

function LocalBrainWindow({
  brain,
  getCurrentSettings,
  onSaveSettings,
}: ILocalBrainWindowProps) {
  const { settingsMap } = brain;

  const showSettings = !!settingsMap && settingsMap.length > 0;

  const currentSettings = getCurrentSettings();

  const onSubmit = (formData: any) => {
    onSaveSettings?.(brain, formData);
  };

  return (
    <div style={{ marginTop: -20, marginLeft: 10 }}>
      <div id="content_container">
        <h2>{brain.displayName}</h2>
        <span style={{ fontSize: 16 }}>{brain.description}</span>
      </div>

      {showSettings && (
        <div id="settings_container" style={{ marginTop: 20 }}>
          <SettingsMapForm
            title="Brain Settings"
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
export default LocalBrainWindow;
