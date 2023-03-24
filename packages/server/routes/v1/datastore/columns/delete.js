const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const { queryListColumns } = require('./_common');

const deleteColumn = ({ project = {}, params = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name, column_name } = params;
	return sql.begin(async (t) => {
		const [column] = await queryListColumns(t, { schema_name, table_name, column_name });

		if (!column) {
			throw new NotFoundError(`Column '${column_name}' not found`);
		}

		await t`--sql
				alter table ${sql(`${schema_name}.${table_name}`)}
				drop column ${sql(column_name)}
			`;

		await t`--sql 
				delete from ${sql('_cms.datastore_columns')} 
					where schema_name=${schema_name}
					and table_name=${table_name}
					and column_name=${column_name}
				`;

		return { column };
	});
};
const routes = async (fastify) => {
	fastify.delete('/v1/:project_code/datastore/tables/:table_name/columns/:column_name', async (request, reply) => {
		const { params, project } = request;
		const result = await deleteColumn({ project, params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, deleteColumn };
