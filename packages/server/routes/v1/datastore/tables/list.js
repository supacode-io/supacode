const { sql } = require('../../../../helpers/db-helper');

const { queryListTables } = require('./_common');

const listTables = async ({ project = {} }) => {
	const { db_schema: schema_name } = project;
	const tables = await queryListTables(sql, { schema_name });
	const total = tables.count;
	return { tables, total };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/datastore/tables', async (request, reply) => {
		const { project } = request;
		const result = await listTables({ project });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listTables };
