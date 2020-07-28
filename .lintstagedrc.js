const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const getIgnore = (ignoreFile, defaultIgnorePatterns) => {
  const ig = ignore();

  if (defaultIgnorePatterns) {
    ig.add(defaultIgnorePatterns);
  }

  if (fs.existsSync(ignoreFile)) {
    const ignoreFileContent = fs.readFileSync(ignoreFile);
    ig.add(ignoreFileContent.toString());
  }

  return ig;
};
const filterIgnore = (ignore, filenames) => ignore.filter(filenames);
const joinMatch = match => match.join(' ');
const getMatch = (filenames, ignoreFile, defaultIgnorePatterns) =>
  joinMatch(filterIgnore(getIgnore(ignoreFile, defaultIgnorePatterns), filenames));

const addCommand = ([command, match]) => (match.length ? `${command} ${match}` : undefined);
const getCommands = (...commands) => commands.map(addCommand).filter(Boolean);

module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => {
    const eslintMatch = getMatch(filenames, path.join('.eslintignore'), ['.*']);
    const prettierMatch = getMatch(filenames, path.join('.prettierignore'));
    return getCommands(
      ['prettier --write', prettierMatch],
      ['eslint --max-warnings=0', eslintMatch],
    );
  },

  '*.{css,scss,sass,less}': ['prettier --write', 'stylelint --fix'],

  '*.{json,md}': [`prettier --write`],
};
