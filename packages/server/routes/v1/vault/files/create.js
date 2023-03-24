const { sql } = require('../../../../helpers/db-helper');
const { getUrlPair } = require('../../../../helpers/file-helper');

const bucket = process.env.AWS_CDN_BUCKET;
const vaultPrefix = process.env.VAULT_PREFIX;

const createFile = ({ project = {}, data = {} }) => {
	const { id: project_id, code: project_code } = project;
	const { name, description, mime_type } = data;
	return sql.begin(async (t) => {
		const fileData = {
			name,
			description,
			mime_type,
			bucket,
			project_id,
		};

		let [file] = await t`--sql
		    insert into ${sql('_cms.vault_files')} ${sql(fileData)} 
			returning id, name
		`;

		const object_key = `${vaultPrefix}/${project_code}/vault/original/${file.name}`;
		const urls = await getUrlPair(object_key, { mimeType: mime_type });
		const partialFile = { url: urls.readUrl, object_key };

		[file] = await t`--sql
		    update ${sql('_cms.vault_files')} set ${sql(partialFile)}
		    where "id" = ${file.id}
			returning *
		`;

		return { file, urls };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/vault/files', async (request, reply) => {
		const { body, project } = request;
		const result = await createFile({ project, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createFile };
