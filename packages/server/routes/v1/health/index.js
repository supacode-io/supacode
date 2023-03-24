const routes = async (fastify) => {
	fastify.get('/health', async (request, reply) => {
		const result = { status: 'ok' };
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
