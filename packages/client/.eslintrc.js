module.exports = {
	extends        : ['@supacode/eslint-config/next', '@supacode/eslint-config/alias-monorepo'],
	ignorePatterns : ['!.stylelintrc.js'],
	env            : {
		browser : true,
		node    : true,
	},
};
