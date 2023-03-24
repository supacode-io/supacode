const rateLimitPlugin = async (fastify) => {
	// eslint-disable-next-line global-require
	await fastify.register(require('@fastify/rate-limit'), {
		max                  : 100,
		timeWindow           : '10 secs',
		errorResponseBuilder : (req, context) => ({
			code    : 'RATE_LIMIT_ERROR',
			message : `Error: Only ${context.max} requests per ${context.after} allowed`,
		}),
	});
	fastify.log.info('Loaded plugin rate-limit');
};

module.exports = rateLimitPlugin;
