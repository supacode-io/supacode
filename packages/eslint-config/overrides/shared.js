const sharedRules = {
	indent: ['error', 'tab', {
		SwitchCase          : 1,
		VariableDeclarator  : 1,
		outerIIFEBody       : 1,
		// MemberExpression: null,
		FunctionDeclaration : {
			parameters : 1,
			body       : 1,
		},
		FunctionExpression: {
			parameters : 1,
			body       : 1,
		},
		CallExpression: {
			arguments: 1,
		},
		ArrayExpression        : 1,
		ObjectExpression       : 1,
		ImportDeclaration      : 1,
		flatTernaryExpressions : false,
		ignoredNodes           : [
			'JSXElement',
			'JSXElement > *',
			'JSXAttribute',
			'JSXIdentifier',
			'JSXNamespacedName',
			'JSXMemberExpression',
			'JSXSpreadAttribute',
			'JSXExpressionContainer',
			'JSXOpeningElement',
			'JSXClosingElement',
			'JSXFragment',
			'JSXOpeningFragment',
			'JSXClosingFragment',
			'JSXText',
			'JSXEmptyExpression',
			'JSXSpreadChild',
		],
		ignoreComments: false,
	}],
	'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
};

module.exports = sharedRules;
