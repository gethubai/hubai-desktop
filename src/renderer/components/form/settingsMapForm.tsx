import React, { useCallback, useMemo } from 'react';
import validator from '@rjsf/validator-ajv8';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { ISettingMap } from 'api-server/models/settingMap';

type SettingsMapFormProps = Omit<
  FormProps,
  'onSubmit' | 'schema' | 'validator'
> & {
  settingsMap?: ISettingMap[];
  currentSettings: any;
  onSubmit: (e: any) => void;
  children?: React.ReactNode;
  title?: string;
  schema?: RJSFSchema;
};

export function MapSettingToSchema(setting: ISettingMap): RJSFSchema {
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

  return property;
}

export function buildProperties(settingsMap?: ISettingMap[]) {
  const required: string[] = [];

  if (!settingsMap) return;

  const properties = {} as any;

  settingsMap.forEach((setting) => {
    const { name } = setting;
    const property = MapSettingToSchema(setting);

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
  title = undefined,
  ...rest
}: SettingsMapFormProps) {
  // TODO: Build only once, not on every render
  const schemaResult = buildProperties(settingsMap);

  const schema: RJSFSchema = useMemo(
    () => ({
      title,
      type: 'object',
      required: schemaResult?.required,
      properties: schemaResult?.properties,
    }),
    [schemaResult, title]
  );

  const onSubmitInternal = useCallback(
    (e: any) => {
      onSubmit?.(e.formData);
    },
    [onSubmit]
  );

  return (
    <Form
      schema={schema}
      formData={currentSettings}
      validator={validator}
      onSubmit={onSubmitInternal}
      noValidate
      {...rest}
    >
      {children}
    </Form>
  );
}
export default SettingsMapForm;
