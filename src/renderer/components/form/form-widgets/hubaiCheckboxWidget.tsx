import React from 'react';
import { Checkbox } from '@hubai/core/esm/components';
import { WidgetProps } from '@rjsf/utils';

export default function HubaiCheckboxWidget({
  schema,
  id,
  value,
  defaultValue,
  onChange,
}: WidgetProps) {
  let valueParsed = value;
  if (typeof valueParsed === 'string') {
    valueParsed = value === 'true';
  }

  return (
    <Checkbox
      id={id}
      value={valueParsed}
      checked={value === undefined ? defaultValue : valueParsed}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.checked)
      }
    >
      {schema.description ?? schema.title}
    </Checkbox>
  );
}
