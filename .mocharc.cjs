'use strict'

module.exports = {
  require: [
    'tsconfig-paths/register',
    'ts-node/register',
    './src/test/register.ts',
    // './dist/node/test/register.cjs',
  ],
  'watch-files': ['./src/**'],
  ignore       : ['./**/*.d.ts', './**/-deprecated/**'],
  'node-option': [

  ],
}
