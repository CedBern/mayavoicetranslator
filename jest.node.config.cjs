// Jest config for Node.js API tests (CommonJS)
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/services/**/*.test.js',
    '<rootDir>/**/*.api.test.js',
  ],
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
};
