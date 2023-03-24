const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const deleteRow = ({ project = {}, params = {} }) => {
	const { db_schema: schema_name } = project;
	const { table_name, row_id } = params;
	return sql.begin(async (t) => {
		let [row] = await t`--sql
			select _id from ${sql(`${schema_name}.${table_name}`)}
			where _id=${row_id}
			`;

		if (!row) {
			throw new NotFoundError(`Row with id '${row_id}' not found`);
		}

		[row] = await t`--sql
				delete from ${sql(`${schema_name}.${table_name}`)}
				where _id=${row_id}
				returning *
			`;
		return { row };
	});
};

const routes = async (fastify) => {
	fastify.delete('/v1/:project_code/datastore/tables/:table_name/rows/:row_id', async (request, reply) => {
		const { project, params } = request;
		const result = await deleteRow({ project, params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
