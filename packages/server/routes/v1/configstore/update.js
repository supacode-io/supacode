const { sql } = require('../../../helpers/db-helper');

const updateContent = async (data) => {
	const formattedData = {
		key   : data.file_name,
		value : data.file_data,
	};
	await sql.begin(async () => {
		const updatedContent = await sql`
            update _cms.configstore_content set ${sql(formattedData)}
            where key = ${formattedData.key}
`;
		return updatedContent;
	});
	return { success: true };
};

const routes = async (fastify) => {
	fastify.patch('/v1/configstore/', async (request, reply) => {
		const { body } = request;
		const result = await updateContent(body);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, updateContent };
