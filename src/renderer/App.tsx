import 'reflect-metadata';
import React, { useEffect, useState } from 'react';
import './App.css';
import './dependencyInjection';
import './settings/electronSettingsStore';
import mo, { create } from 'mo';
import { Workbench } from 'mo/workbench/workbench';
import '@hubai/core/esm/style/mo.css';
import './mo-lib/style/styles.scss';
import InstanceService from 'mo/services/instanceService';
import { BuiltInColorTheme } from 'mo/services/theme/colorThemeService';
import debounce from 'lodash/debounce';
import loadExtensions from './features/extensions/extensionLoader';
import { container } from 'tsyringe';
import { IBrainManagementService } from './features/brain/services/brainManagement';

const setStartupActivityBar = async () => {
  try {
    const brainManagementService = container.resolve<IBrainManagementService>(
      'IBrainManagementService'
    );

    const brains = await brainManagementService.getPackagesAsync();
    // If there are no brains installed, we set the packagestore as the default activityBar
    const activityBarId = brains?.length
      ? `brain-${brains[0].id}`
      : 'packageStore.sidebarPane';
    mo.activityBar.setActive(activityBarId);
    mo.sidebar.setActive(activityBarId);
  } catch (error) {
    console.error('Could not set default activityBar', error);
  }
};

export default function App() {
  const [moInstance, setMoInstance] = useState<InstanceService | null>(null);

  useEffect(() => {
    const loadAndCreate = async () => {
      const extensions = await loadExtensions();
      const instance = create({ extensions });

      instance.onAfterLoad(() => {
        const settings = mo.settings.getSettings();

        const currentTheme =
          settings.colorTheme && mo.colorTheme.getThemeById(settings.colorTheme)
            ? settings.colorTheme
            : BuiltInColorTheme.id;

        mo.colorTheme.setTheme(currentTheme);

        const updateSettingsWhenThemeIsChanged = debounce((prev, next) => {
          mo.settings.update({ colorTheme: next.id });
          mo.settings.saveSettings();
        }, 600);

        mo.colorTheme.onChange(updateSettingsWhenThemeIsChanged);

        setStartupActivityBar();
      });

      setMoInstance(instance);
    };

    loadAndCreate();
  }, []);

  if (!moInstance) {
    // You could return some loading state here
    return null;
  }

  return moInstance.render(<Workbench />);
}
