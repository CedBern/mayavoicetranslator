// Jest mock for NativePlatformConstantsIOS (directory import)
module.exports = {
  getConstants: () => ({
    forceTouchAvailable: false,
    interfaceIdiom: 'phone',
    osVersion: '14.0',
    systemName: 'iOS',
    isTesting: true,
  }),
};
