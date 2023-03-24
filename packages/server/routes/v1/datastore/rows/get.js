const { sqlJoin, sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');
const { queryListColumns } = require('../columns/_common');

const getRow = async ({ project = {}, params = {}, includes = '0' }) => {
	const { db_schema: schema_name } = project;
	const { table_name, row_id } = params;

	const columns = await queryListColumns(sql, { schema_name, table_name });

	const tableAlias = 't';

	const keys = [];
	const joinClauses = [];

	columns.forEach((column, index) => {
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

	const [row] = await sql`
		select ${sqlJoin(keys, sql`, `)} from ${sql(`${schema_name}.${table_name}`)} ${sql(tableAlias)}
		${joinClauses.length > 0 ? sqlJoin(joinClauses, sql``) : sql``}
		where ${sql(`${tableAlias}._id`)}=${row_id}
	`;

	if (!row) {
		throw new NotFoundError(`Row '${row_id}' not found`);
	}

	return { row };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables/:table_name/rows/:row_id', async (request, reply) => {
		const { params, query, project } = request;
		const { includes } = query;
		const result = await getRow({ project, params, includes });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, getRow };
