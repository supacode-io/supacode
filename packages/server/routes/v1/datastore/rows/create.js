const { sql, sqlJoin } = require('../../../../helpers/db-helper');
const { queryListColumns } = require('../columns/_common');

const createRow = ({ project = {}, params = {}, data = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name } = params;

	return sql.begin(async (t) => {
		const columns = await queryListColumns(t, { schema_name, table_name });

		const columnNames = [];
		const dataValues = [];
		columns.forEach((column) => {
			if (column.column_name !== '_id' && data[column.column_name]) {
				columnNames.push(sql(column.column_name));
				dataValues.push(data[column.column_name]);
			}
		});

		const [row] = await t`--sql
			insert into ${sql(`${schema_name}.${table_name}`)}
			(${sqlJoin(columnNames, sql`, `)})
			values
			(${sqlJoin(dataValues, sql`, `)})
			returning *
		`;

		return { row };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/datastore/tables/:table_name/rows', async (request, reply) => {
		const { project, params, body } = request;
		const result = await createRow({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createRow };
