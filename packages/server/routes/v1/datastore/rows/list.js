const { sql, sqlJoin } = require('../../../../helpers/db-helper');
const { cleanUdt } = require('../../../../helpers/type-helper');
const { queryListColumns } = require('../columns/_common');

const listRows = async ({ project = {}, params = {}, limit = 10, q, cols = 'name', offset = 0, includes }) => {
	const { db_schema: schema_name } = project;
	const { table_name, filters = {} } = params;

	const columns = await queryListColumns(sql, { schema_name, table_name });

	const tableAlias = 't';

	const keys = [];
	const whereClauses = [];
	const joinClauses = [];

	if (q) whereClauses.push(sql` ${sql(cols)} ilike ${`%${q}%`}`);

	columns.forEach((column, index) => {
		if (filters[column.column_name]) {
			const typecast = sql.unsafe(cleanUdt(column.underlying_type));
			whereClauses.push(sql`
				${sql(`${tableAlias}.${column.column_name}`)} = ${filters[column.column_name]}::${typecast}
			`);
		}
		if (includes === '1' && column.is_reference) {
			const refAlias = `r${index}`;
			const { reference_schema, reference_table, reference_column } = column;
			joinClauses.push(sql`
				left join ${sql(`${reference_schema}.${reference_table}`)} as ${sql(refAlias)} 
					on ${sql(`${refAlias}.${reference_column}`)} = ${sql(`${tableAlias}.${column.column_name}`)}
			`);
			keys.push(sql`row_to_json(${sql(refAlias)}.*) as ${sql(column.column_name)}`);
		} else {
			keys.push(sql(`${tableAlias}.${column.column_name}`));
		}
	});

	const rows = await sql`
		select ${sqlJoin(keys, sql`, `)} from ${sql(`${schema_name}.${table_name}`)} ${sql(tableAlias)}
		${joinClauses.length > 0 ? sqlJoin(joinClauses, sql``) : sql``}
		${whereClauses.length > 0 ? sql`where ${sqlJoin(whereClauses, sql` and `)}` : sql``}
		order by _created_on desc
		limit ${limit} offset ${offset}
	`;

	const [{ count: total }] = await sql`
		select count(_id) from ${sql(`${schema_name}.${table_name}`)} ${sql(tableAlias)}
		${whereClauses.length > 0 ? sql`where ${sqlJoin(whereClauses, sql` and `)}` : sql``}
	`;

	return { rows, total: parseInt(total, 10), limit, offset };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables/:table_name/rows', async (request, reply) => {
		const { params, query, project } = request;
		const { f, limit, offset, includes, q, cols } = query;
		const result = await listRows({
			project,
			params: { ...params, filters: f },
			limit,
			offset,
			includes,
			q,
			cols,
		});
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listRows };
