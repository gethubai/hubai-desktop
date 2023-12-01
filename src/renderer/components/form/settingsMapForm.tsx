import React, { useCallback, useMemo } from 'react';
import validator from '@rjsf/validator-ajv8';
import Form, { FormProps } from '@rjsf/core';
import './style.scss';
import { RJSFSchema, FieldTemplateProps } from '@rjsf/utils';
import { ISettingMap } from 'api-server/models/settingMap';
import { defaultWidgets } from './form-widgets';

function CustomFieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    style,
    label,
    rawDescription,
    required,
    schema,
    errors,
    children,
  } = props;
  return (
    <div className={`${classNames ?? ''} field-container`} style={style}>
      <div className="field-header">
        <label htmlFor={id} style={{ lineHeight: 1 }}>
          <b>
            {label}
            {required ? ' *' : null}
          </b>
        </label>
        {!!rawDescription && schema.type !== 'boolean' && (
          <p>{rawDescription}</p>
        )}
      </div>
      {children}
      {errors}
    </div>
  );
}

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

  let defaultValueParsed: string | boolean | undefined = defaultValue;

  if (type === 'boolean' && typeof defaultValue === 'string') {
    defaultValueParsed = defaultValue === 'true';
  }

  function getEnumValues(): string[] | undefined {
    if (typeof enumValues === 'function') {
      return enumValues?.();
    }

    return enumValues && enumValues.length > 0 ? enumValues : undefined;
  }

  const property = {
    type,
    title: displayName,
    default: defaultValueParsed,
    enum: getEnumValues(),
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
      className="settings-form"
      schema={schema}
      formData={currentSettings}
      validator={validator}
      onSubmit={onSubmitInternal}
      noValidate
      widgets={defaultWidgets}
      templates={{ FieldTemplate: CustomFieldTemplate }}
      {...rest}
    >
      {children}
    </Form>
  );
}
export default SettingsMapForm;
