/* Do not remove these imports or the ModuleFederation will break, since it uses these libraries on the shared */
import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import router from 'react-router-dom';
import lodash from 'lodash';
import 'styled-components';
import icon from '@vscode/codicons';
import monaco from 'monaco-editor';
import '@vscode/codicons/dist/codicon.css';
import core from '@hubai/core';
import { createRoot } from 'react-dom/client';
import { container as DIContainer } from 'tsyringe';
import { DIService } from '@hubai/core/esm/DIService';

import App from './App';

DIService.setContainer(DIContainer);

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
/* window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
}); */
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
