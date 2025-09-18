import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // Test rule to prohibit process.env access
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message: 'Use ensureEnv from @autamedica/shared instead of direct process.env access.',
        },
      ],
    },
  },
  {
    files: ['packages/shared/**/*.{js,ts,tsx}'],
    rules: {
      // Allow process.env only in @autamedica/shared
      'no-restricted-globals': 'off',
    },
  },
];