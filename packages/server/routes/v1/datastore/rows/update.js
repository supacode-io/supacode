const { sql, sqlJoin } = require('../../../../helpers/db-helper');
const { queryListColumns } = require('../columns/_common');

const updateRow = ({ project = {}, params = {}, data = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name, row_id } = params;
	return sql.begin(async (t) => {
		const columns = await queryListColumns(t, { schema_name, table_name });

		let [row] = await t`--sql
			select _id from ${sql(`${schema_name}.${table_name}`)}
			where _id=${row_id}
		`;

		const updatedValues = [];
		columns.forEach((column) => {
			if (column.column_name !== '_id' && data[column.column_name]) {
				updatedValues.push(sql`${sql(column.column_name)}=${data[column.column_name]}`);
			}
		});

		[row] = await t`--sql
			update ${sql(`${schema_name}.${table_name}`)}
			set ${sqlJoin(updatedValues, sql`, `)}
			where _id=${row_id}
			returning *
		`;

		return { row };
	});
};

const routes = async (fastify) => {
	fastify.patch('/v1/:project_code/datastore/tables/:table_name/rows/:row_id', async (request, reply) => {
		const { project, params, body } = request;
		const result = await updateRow({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, updateRow };
