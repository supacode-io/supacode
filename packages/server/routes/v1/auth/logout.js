const routes = async (fastify) => {
	fastify.post('/v1/auth/logout', async (request, reply) => {
		const { sessionStore } = request;
		await sessionStore.destroy();
		const result = { status: 'ok' };
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
