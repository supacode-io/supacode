const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const { queryListTables } = require('./_common');

const deleteTable = async ({ project = {}, params = {} }) => {
	const { db_schema:schema_name } = project;
	const { table_name } = params;
	return sql.begin(async (t) => {
		const [table] = await queryListTables(t, { schema_name, table_name });

		if (!table) {
			throw new NotFoundError(`Table '${table_name}' not found`);
		}

		await t`--sql
				drop table ${sql(`${schema_name}.${table_name}`)}
				`;

		await t`--sql 
				delete from ${sql('_cms.datastore_columns')} 
					where schema_name=${schema_name}
					and table_name=${table_name}
				`;

		return { table };
	});
};

const routes = async (fastify) => {
	fastify.delete('/v1/:project_code/datastore/tables/:table_name', async (request, reply) => {
		const { params, project } = request;
		const result = await deleteTable({ params, project });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, deleteTable };
