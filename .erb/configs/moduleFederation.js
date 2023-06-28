module.exports = {
  name: 'allaiapp',
  // library: { type: 'module' },
  shared: {
    'react-router-dom': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '6.11.2',
    },
    react: {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: '18.2.0',
    },
    'react-dom': {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: '18.2.0',
    },
    '@allai/core': {
      eager: true,
      singleton: true,
      strictVersion: true,
      requiredVersion: '^1.0.5',
    },
    'monaco-editor': {
      eager: true,
      singleton: true,
      strictVersion: true,
      requiredVersion: '^0.31.0',
    },
    '@vscode/codicons': {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: '^0.0.33',
    },
    lodash: {
      singleton: true,
      eager: true,
      strictVersion: false,
      requiredVersion: '^4.17.21',
    },
    'styled-components': {
      singleton: true,
      eager: true,
      strictVersion: false,
      requiredVersion: '^6.0.0',
    },
  },
};
