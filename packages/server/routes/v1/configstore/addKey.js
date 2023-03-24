const { sql } = require('../../../helpers/db-helper');

const addKey = async (data) => {
	const configKey = await sql.begin(async (t) => {
		const createConfigKey = await t`--sql
	        insert into _cms.configstore_content
	        ${sql(data)}
	        `;
		return createConfigKey[0];
	});
	return configKey;
};

const routes = async (fastify) => {
	fastify.post('/v1/configstore', async (request, reply) => {
		const { body } = request;
		const result = await addKey(body);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, addKey };
