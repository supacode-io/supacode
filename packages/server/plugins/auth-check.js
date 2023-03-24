const { ForbiddenError } = require('../helpers/error-helper');

const PUBLIC_ROUTES = [
	'/v1/auth/login',
	'/health',
];

const authCheckPlugin = async (fastify) => {
	await fastify.addHook('preHandler', async (request) => {
		const { sessionId, session } = request;
		if (
			!PUBLIC_ROUTES.includes(request.routerPath)
            && !(sessionId || session)
		) {
			console.log('I am here', request.routerPath);

			throw new ForbiddenError('No permission to access this route');
		}
		return Promise.resolve();
	});
	fastify.log.info('Loaded plugin auth-check');
};

authCheckPlugin[Symbol.for('skip-override')] = true;
module.exports = authCheckPlugin;
