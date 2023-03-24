const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const { queryListTables } = require('./_common');

const getTable = async ({ project = {}, params = {} }) => {
	const { db_schema:schema_name } = project;
	const { table_name } = params;
	const [table] = await queryListTables(sql, { schema_name, table_name });

	if (!table) {
		throw new NotFoundError(`Table '${table_name}' not found`);
	}

	return { table };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables/:table_name', async (request, reply) => {
		const { params, project } = request;
		const result = await getTable({ params: { ...params }, project });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, getTable };
