import React, { useCallback, useMemo } from 'react';
import {
  LocalBrainModel,
  LocalBrainSettingMap,
} from 'api-server/brain/domain/models/localBrain';
import SettingsMapForm, {
  buildProperties,
} from 'renderer/components/form/settingsMapForm';
import { RJSFSchema } from '@rjsf/utils';
import { IChangeEvent } from '@rjsf/core';

type ChatBrainSettingsFormProps = {
  brain: LocalBrainModel;
  currentSettings: any;
  settingsMap?: LocalBrainSettingMap[];
  onFormChange?: (newSettings: any) => void;
};

export function ChatBrainSettingsForm({
  brain,
  currentSettings,
  settingsMap,
  onFormChange,
}: ChatBrainSettingsFormProps) {
  const showSettings = useMemo(
    () => !!settingsMap && settingsMap.length > 0,
    [settingsMap]
  );

  const schema: RJSFSchema = useMemo(() => {
    const chatSchemaResult = buildProperties(settingsMap);

    return {
      title: `${brain.displayName} Settings`,
      type: 'object',
      properties: chatSchemaResult?.properties,
      required: chatSchemaResult?.required,
    };
  }, [settingsMap, brain.displayName]);

  const onChange = useCallback(
    (e: IChangeEvent) => onFormChange?.(e.formData),
    [onFormChange]
  );

  const onSubmit = useCallback(() => {}, []);

  return (
    <div>
      {showSettings ? (
        <div id="settings_container" style={{ marginTop: 20 }}>
          <SettingsMapForm
            settingsMap={settingsMap}
            currentSettings={currentSettings}
            onChange={onChange}
            onSubmit={onSubmit}
            schema={schema}
          >
            <button type="submit" style={{ display: 'none' }}>
              save
            </button>
          </SettingsMapForm>
        </div>
      ) : (
        <div>{brain.displayName} does not have any setting</div>
      )}
    </div>
  );
}
