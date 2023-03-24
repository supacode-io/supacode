const sharedRules = require('./shared');

const base = {
	// js
	camelcase               : 'off',
	'no-tabs'               : 'off',
	indent                  : sharedRules.indent,
	'no-use-before-define'  : sharedRules['no-use-before-define'],
	'no-restricted-exports' : 'off',
	'no-underscore-dangle'  : 'off',
	'max-len'               : ['error', 120],
	'key-spacing'           : ['error', {
		align: {
			on          : 'colon',
			beforeColon : true,
			afterColon  : true,
			mode        : 'strict',
		},
	}],
	'object-curly-newline': ['error', {
		ObjectExpression  : { minProperties: 8, multiline: true, consistent: true },
		ObjectPattern     : { minProperties: 8, multiline: true, consistent: true },
		ImportDeclaration : { minProperties: 8, multiline: true, consistent: true },
		ExportDeclaration : { minProperties: 8, multiline: true, consistent: true },
	}],

	// import
	'import/no-extraneous-dependencies' : 'off',
	'import/prefer-default-export'      : 'off',
	'import/order'                      : ['error',
		{
			groups             : ['builtin', 'external', 'parent', 'sibling', 'index'],
			'newlines-between' : 'always',
			alphabetize        : {
				order           : 'asc',
				caseInsensitive : true,
			},
		},
	],
};

const typescript = {
	// typescript overrides
	indent                                    : 'off',
	'@typescript-eslint/indent'               : sharedRules.indent,
	'no-use-before-define'                    : 'off',
	'@typescript-eslint/no-use-before-define' : sharedRules['no-use-before-define'],
};

const react = {
	// react
	'react/button-has-type'               : 'off',
	'react/jsx-filename-extension'        : 'off',
	'react/prop-types'                    : 'off',
	'react/jsx-props-no-spreading'        : 'off',
	'react/forbid-prop-types'             : 'off',
	'react/react-in-jsx-scope'            : 'off',
	'react/no-unstable-nested-components' : 'off',
	'react/jsx-indent-props'              : ['error', 'tab'],
	'react/require-default-props'         : 'off',
	'react/jsx-indent'                    : ['error', 'tab', {
		checkAttributes          : true,
		indentLogicalExpressions : true,
	}],

	// jsx-a11y
	'jsx-a11y/media-has-caption'            : 'off',
	'jsx-a11y/label-has-associated-control' : 'off',
	'jsx-a11y/click-events-have-key-events' : 'off',
	'jsx-a11y/no-autofocus'                 : 'off',
};

const overided = {
	base,
	react,
	typescript,
};

module.exports = overided;
