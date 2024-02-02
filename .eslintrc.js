module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'arrow-parens': 'off',
    'no-console': 'off',
    quotes: ['error', 'single'],
    'comma-dangle': 'off',
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'static-field',
          'instance-field',
          'static-method',
          'instance-method',
        ],
      },
    ],
    'prefer-arrow-callback': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@tableau/extensions-api-types/*'],
      },
    ],
  },
};
