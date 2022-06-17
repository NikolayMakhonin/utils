'use strict'

module.exports = {
  'extends': [
    'pro',
  ],
  rules: {
    '@typescript-eslint/prefer-literal-enum-member': ['off', { allowBitwiseExpressions: false }],
  },
}
