// Configuration Metro simplifiée
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration simplifiée pour éviter les conflits expo-router
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
