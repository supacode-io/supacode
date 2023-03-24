const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');
const { escapeSingleQuotes } = require('../../../../helpers/santisation-helper');

const { queryListTables } = require('./_common');

const updateTable = async ({ project = {}, params = {}, data = {} }) => {
	const { db_schema:schema_name } = project;
	const { table_name: old_table_name } = params;
	const { table_name, description } = data;

	return sql.begin(async (t) => {
		let [table] = await queryListTables(t, { schema_name, table_name: old_table_name });

		if (!table) {
			throw new NotFoundError(`Table '${table_name}' not found`);
		}

		if (description && table.description !== description) {
			await t`--sql
				comment on table ${sql(`${schema_name}.${old_table_name}`)} 
				is ${sql.unsafe(`E'${escapeSingleQuotes(description)}'`)}
			`;
		}

		if (table_name && table.name !== table_name) {
			await t`--sql
				alter table ${sql(`${schema_name}.${old_table_name}`)} 
				rename to ${sql(table_name)}
			`;

			await t`--sql
				update ${sql('_cms.datastore_columns')}
				set table_name=${table_name} 
				where 
					table_name=${old_table_name}
					and schema_name='public'
			`;
		}

		[table] = await queryListTables(t, { schema_name, table_name: table_name || old_table_name });

		return { table };
	});
};

const routes = async (fastify) => {
	fastify.patch('/v1/:project_code/datastore/tables/:table_name', async (request, reply) => {
		const { params, body, project } = request;
		const result = await updateTable({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, updateTable };
