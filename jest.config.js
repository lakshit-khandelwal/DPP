// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/tests/setup.js'],
    coverageDirectory: './coverage',
    collectCoverage: true,
  };
  