const { ExtendedError } = require('../helpers/error-helper');

const errorHandlerPlugin = async (fastify) => {
	await fastify.setErrorHandler((error, request, reply) => {
		if (error instanceof ExtendedError) {
			return reply.status(error.statusCode).send({
				message : error.message,
				code    : error.code,
				stack   : (error.stack || []).split('\n'),
			});
		}
		return reply.status(500).send({
			message : error.toString(),
			code    : 'ERR_SERVERERROR',
			stack   : (error.stack || []).split('\n'),
		});
	});

	fastify.log.info('Loaded plugin error-handler');
};
errorHandlerPlugin[Symbol.for('skip-override')] = true;
module.exports = errorHandlerPlugin;
