// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/cypress/integration/',
    '/cypress/reports/',
    '/cypress/fixtures/',
    '/cypress/mock/',
  ],
  collectCoverageFrom: ['<rootDir>/cypress/**'],
  coverageReporters: ['lcov', 'text-summary'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(test).[tj]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
