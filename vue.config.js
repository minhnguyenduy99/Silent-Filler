const path = require('path')

module.exports = {
  configureWebpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      game: path.resolve(__dirname, 'src/pixi-core/')
    }
    config.devtool = 'source-map'
  }
}
