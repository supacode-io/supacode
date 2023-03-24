const { sql } = require('../../../helpers/db-helper');

const getContent = async (params) => {
	const { file_name } = params;
	const content = await sql.begin(async (t) => {
		const getConfigStoreContent = await t`--sql
	        select * from _cms.configstore_content
	        where key=${file_name}
	        `;
		return getConfigStoreContent;
	});
	return { success: true, file_data: content[0].value };
};

const routes = async (fastify) => {
	fastify.get('/v1/configstore/:file_name', async (request, reply) => {
		const { params } = request;
		const result = await getContent(params);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, getContent };
