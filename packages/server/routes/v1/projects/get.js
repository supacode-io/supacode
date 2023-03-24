const { sql } = require('../../../helpers/db-helper');

const { queryListProjects } = require('./_common');

const getProject = async ({ params = {} }) => {
	const { id, q, user_id } = params;
	const [project] = await queryListProjects(sql, { id, user_id, q });
	if (project) {
		delete project.user.password;
	}
	return { project };
};

const routes = async (fastify) => {
	fastify.get('/v1/projects/:project_id', async (request, reply) => {
		const { params, query, sessionStore } = request;
		const session = await sessionStore.get();
		const result = await getProject({
			params: {
				id      : params.project_id,
				user_id : session.user.id,
				q       : query.q,
			},
		});
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
