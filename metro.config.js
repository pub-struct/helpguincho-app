const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')


const config = getDefaultConfig(__dirname) // ✅ Para SDK >= 49

const { transformer, resolver } = config

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
}

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
}

module.exports = wrapWithReanimatedMetroConfig(config)

