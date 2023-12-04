import React, { useCallback, useMemo, useState } from 'react';
import { RJSFSchema } from '@rjsf/utils';
import { IChangeEvent } from '@rjsf/core';
import { Button } from '@hubai/core/esm/components';
import { ISettingMap } from '@hubai/core';
import SettingsMapForm, {
  buildProperties,
} from 'renderer/components/form/settingsMapForm';

type ChatBrainSettingsFormProps = {
  formTitle?: string;
  currentSettings: any;
  settingsMap?: ISettingMap[];
  onFormChange?: (newSettings: any) => void;
  onSubmit?: (settings: any) => void;
  validator?: (settings: any) => string | undefined;
};

export function ChatBrainSettingsForm({
  currentSettings,
  settingsMap,
  onFormChange,
  formTitle,
  onSubmit,
  validator,
}: ChatBrainSettingsFormProps) {
  const [error, setError] = useState<string | undefined>();

  const showSettings = useMemo(
    () => !!settingsMap && settingsMap.length > 0,
    [settingsMap]
  );

  const schema: RJSFSchema = useMemo(() => {
    const chatSchemaResult = buildProperties(settingsMap);

    return {
      title: `${formTitle} Settings`,
      type: 'object',
      properties: chatSchemaResult?.properties,
      required: chatSchemaResult?.required,
    };
  }, [settingsMap, formTitle]);

  const onChange = useCallback(
    (e: IChangeEvent) => onFormChange?.(e.formData),
    [onFormChange]
  );

  const onSubmitCallback = useCallback(
    (e: any) => {
      const validatorError = validator?.(e);
      setError(validatorError);

      if (validatorError) {
        return;
      }

      onSubmit?.(e);
    },
    [onSubmit, validator]
  );

  return (
    <div>
      {showSettings ? (
        <div id="settings_container" style={{ marginTop: 20 }}>
          <SettingsMapForm
            settingsMap={settingsMap}
            currentSettings={currentSettings}
            onChange={onChange}
            onSubmit={onSubmitCallback}
            schema={schema}
          >
            <Button
              type="submit"
              style={{ display: onSubmit ? 'block' : 'none' }}
            >
              Save
            </Button>
          </SettingsMapForm>

          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      ) : (
        <div>{formTitle} does not have any setting</div>
      )}
    </div>
  );
}
