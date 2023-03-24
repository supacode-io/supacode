const { getConnectionPool } = require('../helpers/db-connection-helper');

const connectDbPlugin = async (fastify) => {
	await fastify.decorateRequest('db', null);
	await fastify.addHook('preHandler', async (request) => {
		fastify.log.info('Connecting to Database');
		request.db = await getConnectionPool();
		return Promise.resolve();
	});
	fastify.log.info('Loaded plugin connect-db');
};

connectDbPlugin[Symbol.for('skip-override')] = true;
module.exports = connectDbPlugin;
