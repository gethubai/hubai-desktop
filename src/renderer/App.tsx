import * as Sentry from '@sentry/electron/renderer';
import 'reflect-metadata';
import React, { useEffect, useState } from 'react';
import './App.css';
import './dependencyInjection';
import './settings/electronSettingsStore';
import mo, { create } from 'mo';
import { Workbench } from 'mo/workbench/workbench';
import '@hubai/core/esm/style/mo.css';
import './mo-lib/style/styles.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-simple-keyboard/build/css/index.css';
import InstanceService from 'mo/services/instanceService';
import { BuiltInColorTheme } from 'mo/services/theme/colorThemeService';
import debounce from 'lodash/debounce';
import loadExtensions from './features/extensions/extensionLoader';
import { container } from 'tsyringe';
import { IBrainManagementService } from './features/brain/services/brainManagement';
import { AppContext } from '@hubai/core';
import HubaiContext from '@hubai/core/esm/contexts/hubaiContext';

const isDevelopment = process.env.NODE_ENV === 'development'

if (!isDevelopment && process.env.SENTRY_DSN_RENDERER) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN_RENDERER,
      environment: process.env.NODE_ENV,
      enableTracing: false, // performance tracing
      integrations: [
        Sentry.breadcrumbsIntegration({
          console: false, // disable console breadcrumbs
          xhr: false, // disable xhr breadcrumbs
          fetch: false, // disable fetch breadcrumbs
        }),
      ],
    });
  } catch (error) {
    console.error('Failed to initialize Sentry', error);
  }
}

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
  const [appContext, setAppContext] = useState<AppContext | null>(null);

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

      setAppContext(container.resolve<AppContext>('AppContext'));
      setMoInstance(instance);
    };

    loadAndCreate();
  }, []);

  if (!moInstance) {
    // You could return some loading state here
    return null;
  }

  return moInstance.render(
    <>
      <HubaiContext.Provider
        value={{
          services: appContext?.services!,
          theme: {
            getCurrent: () => appContext?.services.theme.getColorTheme()!,
            getColorThemeMode: () =>
              appContext?.services.theme.getColorThemeMode()!,
          },
          i18n: {
            getCurrentLocale: () => mo.i18n.getCurrentLocale()!,
            getLocales: () => mo.i18n.getLocales(),
            localize: (key: string, defaultValue, ...args: string[]) =>
              mo.i18n.localize(key, defaultValue, ...args),
          },
        }}
      >
        <Workbench />
        <ToastContainer />
      </HubaiContext.Provider>
    </>
  );
}
