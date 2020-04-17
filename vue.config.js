const path = require('path')

module.exports = {
  configureWebpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      game: path.resolve(__dirname, 'src/pixi-core/')
    }
    config.devtool = 'source-map'
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.encoding = false
        options.name = 'img/[name].[ext]'
        return options
      })
  }
}
