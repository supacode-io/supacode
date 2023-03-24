const CMS_TYPE_MAP = {
	id         : 'uuid',
	text       : 'varchar(255)',
	long_text  : 'text',
	rich_text  : 'text',
	list       : 'varchar(255)',
	multi_list : 'varchar(255)[]',
	integer    : 'int',
	decimal    : 'float',
	serial     : 'serial',
	timestamp  : 'timestamptz',
	boolean    : 'bool',
	reference  : 'uuid',
	json       : 'jsonb',
};

const cleanUdt = (udt) => udt.replace(/\(.*?\)/g, '');

module.exports = { CMS_TYPE_MAP, cleanUdt };
