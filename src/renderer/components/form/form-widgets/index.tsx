import { RegistryWidgetsType } from '@rjsf/utils';
import HubaiTextWidget from './HubaiTextWidget';
import HubaiCheckboxWidget from './hubaiCheckboxWidget';
import HubaiSelectWidget from './hubaiSelectWidget';

export const defaultWidgets: RegistryWidgetsType = {
  TextWidget: HubaiTextWidget,
  CheckboxWidget: HubaiCheckboxWidget,
  SelectWidget: HubaiSelectWidget,
};

export { HubaiTextWidget, HubaiCheckboxWidget, HubaiSelectWidget };
