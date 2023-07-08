import React, { useCallback, useMemo } from 'react';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { ISettingMap } from 'api-server/models/settingMap';

type SettingsMapFormProps = {
  settingsMap: ISettingMap[];
  currentSettings: any;
  onSubmit: (e: any) => void;
  children: React.ReactNode;
};

function buildProperties(settingsMap: ISettingMap[]) {
  const required: string[] = [];

  if (!settingsMap) return;

  const properties = {} as any;

  settingsMap.forEach((setting) => {
    const { name, displayName, type, defaultValue, enumValues, description } =
      setting;
    const property = {
      type,
      title: displayName,
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

function SettingsMapForm({
  settingsMap,
  currentSettings,
  onSubmit,
  children,
  ...rest
}: SettingsMapFormProps) {
  // TODO: Build only once, not on every render
  const schemaResult = buildProperties(settingsMap);

  const schema: RJSFSchema = useMemo(
    () => ({
      title: 'Extension Settings',
      type: 'object',
      required: schemaResult?.required,
      properties: schemaResult?.properties,
    }),
    [schemaResult]
  );

  const onSubmitInternal = useCallback(
    (e: any) => {
      onSubmit?.(e.formData);
    },
    [onSubmit]
  );

  return (
    <Form
      {...rest}
      schema={schema}
      formData={currentSettings}
      validator={validator}
      onSubmit={onSubmitInternal}
      noValidate
    >
      {children}
    </Form>
  );
}
export default SettingsMapForm;
