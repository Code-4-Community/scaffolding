const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  { ignores: ['**/eslint.config.js'] },
  ...baseConfig,
  ...compat.extends('plugin:@nx/react'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
];
