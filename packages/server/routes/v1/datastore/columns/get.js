const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const { queryListColumns } = require('./_common');

const getColumn = async ({ project = {}, params = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name, column_name } = params;
	const [column] = await queryListColumns(sql, { schema_name, table_name, column_name });

	if (!column) {
		throw new NotFoundError(`Column '${column_name}' not found`);
	}

	return { column };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables/:table_name/columns/:column_name', async (request, reply) => {
		const { params, project } = request;
		const result = await getColumn({ project, params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, getColumn };
