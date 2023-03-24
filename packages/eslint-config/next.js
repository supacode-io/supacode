const overrides = require('./overrides');

module.exports = {
	extends       : ['airbnb', 'airbnb/hooks'],
	parserOptions : { ecmaVersion: 2020 },
	rules         : {
		...overrides.base,
		...overrides.react,
	},
};
