const { resolve } = require('path')

module.exports = {
  entry: 'src/index.js',
  outputDir: 'dist',
  publicPath: './',
  hash: true,
  alias: {
    '@src': resolve(__dirname, 'src'),
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    [
      'ice-plugin-fusion',
      {
        themeConfig: {
          primaryColor: '#1890ff',
        },
      },
    ],
    [
      'ice-plugin-moment-locales',
      {
        locales: ['zh-cn'],
      },
    ],
  ],
  proxy: {
    '/api/v1/': {
      enable: true,
      target: 'http://localhost:5001',
    },
  },
}
