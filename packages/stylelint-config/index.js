module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-recess-order',
	],
	ignoreFiles: [
		'dist/**/*',
		'out/**/*',
		'.next/**/*',
		'node_modules/**/*',
	],
	rules: {
		indentation              : 'tab',
		'selector-class-pattern' : [
			'^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',
			{
				message: 'Expected id selector to be snake_case',
			},
		],
		'at-rule-empty-line-before': [
			'always',
			{
				except        : ['first-nested', 'after-same-name'],
				ignore        : ['after-comment'],
				ignoreAtRules : ['else'],
			},
		],
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global'],
			},
		],
	},
};
