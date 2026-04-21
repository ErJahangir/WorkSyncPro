module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@theme': './src/theme',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
