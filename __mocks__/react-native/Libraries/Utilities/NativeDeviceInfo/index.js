// Mock for react-native/Libraries/Utilities/NativeDeviceInfo/index.js
const mock = {
  getConstants: () => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 2 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
    },
    isTesting: true,
  }),
};
module.exports = mock;
module.exports.default = mock;
