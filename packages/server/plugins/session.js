const { getSession, setSession, destroySession } = require('../helpers/session-helper');

const sessionPlugin = async (fastify) => {
	fastify.decorateRequest('sessionId', null);
	fastify.decorateRequest('sessionStore', null);

	await fastify.addHook('preHandler', async (request) => {
		const { authorization = '' } = request.headers;
		const [tokenType, token] = authorization.split(' ');
		const sessionId = token;
		const sessionStore = {
			get     : () => getSession(sessionId),
			set     : (session) => setSession(sessionId, session),
			destroy : () => destroySession(sessionId),
		};
		const session = await sessionStore.get();

		if (tokenType === 'Bearer' && session) {
			request.sessionId = sessionId;
		}
		request.sessionStore = sessionStore;

		return Promise.resolve();
	});
	fastify.log.info('Loaded plugin session');
};

sessionPlugin[Symbol.for('skip-override')] = true;
module.exports = sessionPlugin;
