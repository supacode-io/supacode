const escapeSingleQuotes = (string) => string.replace(/'/g, '\\\'');

const unescapeSingleQuotes = (string) => string.replace(/\\'/g, '\'');

module.exports = { escapeSingleQuotes, unescapeSingleQuotes };
