import 'reflect-metadata';
import React from 'react';
import './dependencyInjection';
import './settings/electronSettingsStore';
import { create } from 'mo';
import { Workbench } from 'mo/workbench/workbench';
import '@allai/core/esm/style/mo.css';

const moInstance = create({ extensions: [] });

export default function App() {
  return moInstance.render(<Workbench />);
}
