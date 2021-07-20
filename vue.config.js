module.exports = {
  lintOnSave: false,
  publicPath: '/adoa/v/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8100'
      }
    },
    inline: false
  }
}
