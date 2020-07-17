module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    'prefer-const': 'off',
    'no-tabs': 'off',
    'no-undef': 'off',
    'scss(css-identifierexpected)': 'off',
    indent: 'off',
    'quote-props': 'off',
    'camelcase': 'off'
  }
}
