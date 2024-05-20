import React, { useCallback } from 'react';
import { Input } from '@hubai/core/esm/components';
import { WidgetProps } from '@rjsf/utils';

export default function HubaiTextWidget({
  schema,
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
}: WidgetProps) {
  let inputType = 'text'; // default to text input

  if (schema.isSecret) {
    inputType = 'password';
  } else {
    switch (schema.type) {
      case 'integer':
        inputType = 'number';
        break;
      case 'number':
        inputType = 'text'; // Use text input to allow floating points, validate manually
        break;
      default:
        break;
    }
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (schema.type === 'number' && Number.isNaN(Number(inputValue))) {
        if (!value) {
          onChange('0');
        }

        return; // Don't update the value if it's not a valid number
      }

      if (schema.type === 'integer' && !Number.isInteger(Number(inputValue))) {
        return; // Don't update the value if it's not a valid integer
      }

      onChange(inputValue);
    },
    [onChange, value, schema.type]
  );

  return (
    <Input
      type={inputType}
      id={id}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange as any}
      placeholder={placeholder}
    />
  );
}
