module.exports = {
  plugins: {
    
    'postcss-discard-comments': {
      removeAll: true
    },
    'postcss-remove-rules': {
      rules: [
        '.form-floating>~label',
        '.btn-group>+.btn', 
        '.btn-group-vertical>+.btn'
      ]
    }
  }
}