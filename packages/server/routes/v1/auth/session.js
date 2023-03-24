const routes = async (fastify) => {
	fastify.get('/v1/auth/session', async (request, reply) => {
		const { sessionId, sessionStore } = request;
		const session = await sessionStore.get();
		if (!session) {
			return reply.status(401).send({ message: 'Session not available' });
		}
		const result = { sessionId, session };
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
