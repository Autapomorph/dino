const { CLIEngine } = require('eslint');

module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => {
    const filenamesString = filenames.join(' ');
    const eslintMatch = filenames.filter(file => !new CLIEngine({}).isPathIgnored(file)).join(' ');

    return [
      `prettier --write ${filenamesString}`,
      `stylelint ${filenamesString}`,
      `eslint --max-warnings=0 ${eslintMatch}`,
    ];
  },

  '*.{css,scss,sass,less}': ['prettier --write', 'stylelint --fix'],

  '*.{json,md}': [`prettier --write`],
};
