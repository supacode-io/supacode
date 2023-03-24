const cors = require('@fastify/cors');

const corsPlugin = async (fastify) => {
	await fastify.register(cors);
	fastify.log.info('Loaded plugin cors');
};

corsPlugin[Symbol.for('skip-override')] = true;
module.exports = corsPlugin;
