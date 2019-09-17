module.exports = {
  'src/**/*.js': ['prettier --write', 'eslint --max-warnings=0', 'git add'],
  'src/**/*.css': ['prettier --write', 'stylelint --fix', 'git add'],
  '*.{json,md}': ['prettier --write', 'git add'],
};
