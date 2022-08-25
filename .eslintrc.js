module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
    'semi': [2, 'always'],
    'comma-dangle': [0, 'always'],
    'quote-props': [0, 'as-needed', { 'keywords': true }],
    'no-mixed-operators': 'off',
    'multiline-ternary': 'off',
  }
};
