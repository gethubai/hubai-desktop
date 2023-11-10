import SettingsMapForm from 'renderer/components/form/settingsMapForm';
import { Button } from '@hubai/core/esm/components';
import { IBrainController } from '../controllers/type';
import { IBrainState, LocalBrainViewModel } from '../models/brain';
import { ScrollBar } from '@hubai/core/esm/components/scrollBar';

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
    <ScrollBar>
      <div style={{ marginTop: -20, marginLeft: 10, height: '100%' }}>
        <div id="content_container">
          <h2>{brain.displayName} v{brain.version}</h2>
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
                <Button type="submit">Save Settings</Button>
              </div>
            </SettingsMapForm>
          </div>
        )}
      </div>
    </ScrollBar>
  );
}
export default LocalBrainWindow;
