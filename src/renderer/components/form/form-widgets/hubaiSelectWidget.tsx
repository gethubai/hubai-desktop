import { WidgetProps } from '@rjsf/utils';
import { Select, Option } from '@hubai/core/esm/components';

export default function HubaiSelectWidget({
  id,
  value,
  options,
  onChange,
  defaultValue,
}: WidgetProps) {
  return (
    <Select
      id={id}
      value={value ?? defaultValue}
      onSelect={(e, option) => onChange(option?.value)}
    >
      {options?.enumOptions?.map((option) => (
        <Option key={`${id}-option-${option.value}`} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}
