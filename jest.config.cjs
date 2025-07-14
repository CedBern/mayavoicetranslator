module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js', '<rootDir>/jest.global-mocks.js'],
  setupFilesAfterEnv: ['<rootDir>/testing/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/contexts/$1',
    // Mock pour les specs_DEPRECATED ESM
    '^react-native/src/private/specs_DEPRECATED/(.*)$': '<rootDir>/__mocks__/react-native/src/private/specs_DEPRECATED.js',
    // Mock direct pour ActivityIndicatorViewNativeComponent.js
    '^react-native/Libraries/Components/ActivityIndicator/ActivityIndicatorViewNativeComponent$': '<rootDir>/__mocks__/react-native/Libraries/Components/ActivityIndicator/ActivityIndicatorViewNativeComponent.js',
    // Mock pour Platform.ios.js natif (évite getConstants)
    '^react-native/Libraries/Utilities/Platform.ios$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/Platform.ios.js',
    // Mock pour NativePlatformConstantsIOS natif (évite getConstants)
    '^react-native/Libraries/Utilities/NativePlatformConstantsIOS$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/NativePlatformConstantsIOS.js',
    '^react-native/Libraries/Utilities/NativePlatformConstantsIOS/index$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/NativePlatformConstantsIOS/index.js',
    // Mock pour NativeDeviceInfo natif (évite getConstants)
    '^react-native/Libraries/Utilities/NativeDeviceInfo$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/NativeDeviceInfo.js',
    '^react-native/Libraries/Utilities/NativeDeviceInfo.js$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/NativeDeviceInfo.js',
    '^react-native/Libraries/Utilities/NativeDeviceInfo/index$': '<rootDir>/__mocks__/react-native/Libraries/Utilities/NativeDeviceInfo/index.js',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{ts,tsx,js}',
    '<rootDir>/**/*.{test,spec}.{ts,tsx,js}',
    '<rootDir>/services/**/*.test.js',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    // Forcer la transformation Babel sur tous les node_modules sauf une liste blanche minimale (exclure seulement les modules natifs non JS)
    'node_modules/(?!(jest-expo|expo|expo-modules-core|@react-native|expo-router|expo-font|expo-asset|@expo|@react-navigation|react-native|react-native-reanimated|react-native-gesture-handler|react-native-svg|@sentry/react-native)/)',
  ],
};
