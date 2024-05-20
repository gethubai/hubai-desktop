module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'erb',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-named-as-default': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'promise/always-return': 'off',
    'react/state-in-constructor': 'off',
    'no-empty-function': 'off',
    'react/no-unused-class-component-methods': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/sort-comp': 'off',
    'react/no-unused-state': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'react/require-default-props': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-await-in-loop': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
