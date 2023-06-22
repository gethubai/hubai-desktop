import 'reflect-metadata';
import React from 'react';
import './settings/electronSettingsStore';
import './dependencyInjection';
import { create, Workbench } from 'mo';
import './mo-lib/style/mo.scss';

const moInstance = create({ extensions: [] });

export default function App() {
  return moInstance.render(<Workbench />);
}
