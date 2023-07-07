import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { LocalBrainSettingMap } from 'api-server/brain/domain/models/localBrain';
import { IBrainController } from '../controllers/type';
import { IBrainState, LocalBrainViewModel } from '../models/brain';

export interface ILocalBrainWindowProps extends IBrainController, IBrainState {
  brain: LocalBrainViewModel;
  getCurrentSettings: () => any;
}

function buildProperties(settingsMap: LocalBrainSettingMap[]) {
  const required: string[] = [];

  if (!settingsMap) return;

  const properties = {} as any;

  settingsMap.forEach((setting) => {
    const { name, title, type, defaultValue, enumValues, description } =
      setting;
    const property = {
      type,
      title,
      default: defaultValue,
      enum: enumValues && enumValues.length > 0 ? enumValues : undefined,
      description,
      originalName: name,
    };

    const keyName = name; // name.split('.').pop();

    if (setting.required) {
      required.push(keyName);
    }

    properties[keyName] = property;
  });

  return { properties, required };
}

function LocalBrainWindow({
  brain,
  getCurrentSettings,
  onSaveSettings,
}: ILocalBrainWindowProps) {
  const { settingsMap } = brain;

  let schema: RJSFSchema;

  const showSettings = !!settingsMap && settingsMap.length > 0;

  if (showSettings) {
    const schemaResult = buildProperties(settingsMap);
    schema = {
      title: 'Brain Settings',
      type: 'object',
      required: schemaResult?.required,
      properties: schemaResult?.properties,
    };
  }

  const currentSettings = getCurrentSettings();

  const onSubmit = (e) => {
    onSaveSettings?.(brain, e.formData);
  };

  return (
    <div style={{ marginTop: -20, marginLeft: 10 }}>
      <div id="content_container">
        <h2>{brain.displayName}</h2>
        <span style={{ fontSize: 16 }}>{brain.description}</span>
      </div>

      {showSettings && (
        <div id="settings_container" style={{ marginTop: 20 }}>
          <Form
            schema={schema}
            formData={currentSettings}
            validator={validator}
            onSubmit={onSubmit}
            noValidate
          >
            <div>
              <button type="submit">Save Settings</button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
export default LocalBrainWindow;
