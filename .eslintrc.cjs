'use strict'

module.exports = {
  'extends': [
    'pro',
  ],
  // TODO update eslint-config-pro
  rules: {
    '@typescript-eslint/prefer-literal-enum-member': ['off', { allowBitwiseExpressions: false }],
  },
}
