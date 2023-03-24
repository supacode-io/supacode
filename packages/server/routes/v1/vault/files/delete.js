const { cmsSchema } = require('../../../../constants');
const { sql:Sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');
const { deleteObject } = require('../../../../helpers/file-helper');

const deleteFile = ({ project = {}, params = {} }) => {
	const { id: project_id } = project;
	const { file_id } = params;
	return Sql.begin(async (sql) => {
		let [file] = await sql`
			select * from ${sql(`${cmsSchema}.vault_files`)}
			where id=${file_id} and project_id=${project_id}
		`;

		if (file) {
			[file] = await sql`
				delete from ${sql(`${cmsSchema}.vault_files`)}
				where id=${file_id}
				returning *
			`;
		} else {
			throw new NotFoundError('Vault file not found');
		}

		await deleteObject(file.object_key);

		return { file };
	});
};

const routes = async (fastify) => {
	fastify.delete('/v1/:project_code/vault/files/:file_id', async (request, reply) => {
		const { params, project } = request;
		const result = await deleteFile({ project, params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
