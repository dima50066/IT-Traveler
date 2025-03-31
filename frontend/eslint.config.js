module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/vue3-essential', // або 'plugin:vue/vue3-recommended' для суворіших правил
    'eslint:recommended',
    'plugin:prettier/recommended' // Інтеграція Prettier
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // Порушення форматування Prettier як помилки ESLint
    'vue/multi-word-component-names': 'off' // Вимикаємо правило для назв компонентів (опціонально)
  }
}
