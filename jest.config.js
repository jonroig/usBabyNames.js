export default {
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)', '**/?(*.)+(spec|test).mjs'],
  testEnvironment: 'node',
};