module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  'max-len': 120,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
  ],
};
