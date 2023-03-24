const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);

const sqlJoin = (arr, joiner = sql`, `) => arr.reduce((acc, item, index) => {
	const fragment = sql`${acc}${index !== 0 ? joiner : sql``}${item}`;
	return fragment;
}, sql``);

module.exports = { sql, sqlJoin };
