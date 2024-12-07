import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '@/(.*)': ['<rootDir>/src/$1'],
  },
  clearMocks: true,
  collectCoverage: false,
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  coveragePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/src/types', '<rootDir>/src/index.ts'],
};

export default config;
