const { dependencies } = require('../../package.json');

module.exports = {
  name: 'hubai',
  // library: { type: 'module' },
  shared: {
    'react-router-dom': {
      singleton: true,
      strictVersion: false,
      requiredVersion: dependencies['react-router-dom'],
    },
    react: {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: dependencies.react,
    },
    'react-dom': {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: dependencies['react-dom'],
    },
    '@hubai/core': {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: dependencies['@hubai/core'],
    },
    'monaco-editor': {
      eager: true,
      singleton: true,
      strictVersion: true,
      requiredVersion: dependencies['monaco-editor'],
    },
    '@vscode/codicons': {
      eager: true,
      singleton: true,
      strictVersion: false,
      requiredVersion: dependencies['@vscode/codicons'],
    },
    lodash: {
      singleton: true,
      eager: true,
      strictVersion: false,
      requiredVersion: dependencies.lodash,
    },
    'styled-components': {
      singleton: true,
      eager: true,
      strictVersion: false,
      requiredVersion: dependencies['styled-components'],
    },
  },
};
