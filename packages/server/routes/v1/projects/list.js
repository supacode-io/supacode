const { sql } = require('../../../helpers/db-helper');

const { queryListProjects } = require('./_common');

const listProjects = async ({ params = {} }) => {
	const { id, code, q, user_id } = params;
	let projects = await queryListProjects(sql, { id, code, user_id, q });
	projects = projects.map((p) => {
		// eslint-disable-next-line no-param-reassign
		delete p.user.password;
		return p;
	});
	return { projects };
};

const routes = async (fastify) => {
	fastify.get('/v1/projects', async (request, reply) => {
		const { query, sessionStore } = request;
		const session = await sessionStore.get();
		const params = {
			user_id : session.user.id,
			q       : query.q,
		};
		const result = await listProjects({ params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listProjects };
