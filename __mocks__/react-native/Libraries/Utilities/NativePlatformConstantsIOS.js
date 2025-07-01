// Jest mock for NativePlatformConstantsIOS.js to avoid getConstants error
module.exports = {
  getConstants: () => ({
    forceTouchAvailable: false,
    interfaceIdiom: 'phone',
    osVersion: '14.0',
    systemName: 'iOS',
    isTesting: true,
  }),
};
