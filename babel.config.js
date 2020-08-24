module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
      },
    ],
  ],
};
