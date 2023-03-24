const overrides = require('./overrides');

module.exports = {
	extends       : ['airbnb-base'],
	parserOptions : { ecmaVersion: 2020 },
	rules         : {
		...overrides.base,
	},
};
