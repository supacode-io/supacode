const { sql: Sql, sqlJoin } = require('../../../../helpers/db-helper');

const updateFile = ({ project = {}, params = {}, data = {} }) => {
	const { id: project_id } = project;
	const { file_id } = params;
	const { name, description } = data;

	return Sql.begin(async (sql) => {
		let [file] = await sql`
			select * from ${sql('_cms.vault_files')}
			where id=${file_id} and project_id=${project_id}
		`;

		const updatedValues = [];
		if (!!name && name !== file.name) {
			updatedValues.push(sql`${sql('name')}=${name}`);
		}
		if (!!description && description !== file.description) {
			updatedValues.push(sql`${sql('description')}=${description}`);
		}

		if (updatedValues.length > 0) {
			[file] = await sql`
				update ${sql('_cms.vault_files')}
				set ${sqlJoin(updatedValues, sql`, `)}
				where id=${file_id} and project_id=${project_id}
				returning *
			`;
		}

		return { file };
	});
};

const routes = async (fastify) => {
	fastify.patch('/v1/:project_code/vault/files/:file_id', async (request, reply) => {
		const { params, body, project } = request;
		const result = await updateFile({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
