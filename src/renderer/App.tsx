import 'reflect-metadata';
import React, { useEffect, useState } from 'react';
import './dependencyInjection';
import './settings/electronSettingsStore';
import { create } from 'mo';
import { Workbench } from 'mo/workbench/workbench';
import '@hubai/core/esm/style/mo.css';
import './mo-lib/style/styles.scss';
import InstanceService from 'mo/services/instanceService';
import loadExtensions from './features/extensions/extensionLoader';

export default function App() {
  const [moInstance, setMoInstance] = useState<InstanceService | null>(null);

  useEffect(() => {
    const loadAndCreate = async () => {
      const extensions = await loadExtensions();
      const instance = create({ extensions });
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
