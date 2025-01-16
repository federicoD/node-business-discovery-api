import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest for TypeScript support
  testEnvironment: 'node', // Set the test environment
  /*moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your path aliases
  },*/
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
  },
};

export default config;