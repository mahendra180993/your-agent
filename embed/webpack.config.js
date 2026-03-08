const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/chatbot.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbot.min.js',
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
