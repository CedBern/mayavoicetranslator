// Jest mock for Platform.ios.js to avoid ESM/NativePlatformConstantsIOS errors
module.exports = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
  constants: {},
  isTesting: true,
};
