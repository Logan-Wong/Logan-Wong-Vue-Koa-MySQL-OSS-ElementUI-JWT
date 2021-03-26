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
    // 关闭定义的变量未改变过不使用 const 报错
    "prefer-const": "off",
    // 允许非驼峰命名
    "camelcase": 0,
    // 关闭多个空格
    "no-multi-spaces": "off",
    "no-tabs": "off",
    "space-before-function-paren": 0
  }
}
