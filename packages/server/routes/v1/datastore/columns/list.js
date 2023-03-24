const { sql } = require('../../../../helpers/db-helper');

const { queryListColumns } = require('./_common');

const listColumns = async ({ project = {}, params = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name } = params;
	const columns = await queryListColumns(sql, { schema_name, table_name });
	const total = columns.length;
	return { columns, total };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables/:table_name/columns', async (request, reply) => {
		const { params, project } = request;
		const result = await listColumns({ project, params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listColumns };
