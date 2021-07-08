module.exports = {
  lintOnSave: false,
  publicPath: '/dpt/v/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8100'
      }
    },
    inline: false
  }
}
