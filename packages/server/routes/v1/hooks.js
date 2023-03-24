const { sql } = require('../../helpers/db-helper');
const { NotFoundError } = require('../../helpers/error-helper');

const { queryListProjects } = require('./projects/_common');

const hooks = async (fastify) => {
	fastify.decorateRequest('project', null);
	fastify.addHook('preHandler', async (request) => {
		const { params, query } = request;
		let project_code;
		if (request.params.project_code) project_code = params.project_code;
		if (request.query.project_code) project_code = query.project_code;

		let project;
		if (project_code) {
			[project] = await queryListProjects(sql, { code: project_code });
		}
		if (project_code && !project) {
			throw new NotFoundError('Project does not exist');
		}

		request.project = project;
	});
	fastify.log.info('Loaded hooks from ./v1/hooks');
};
hooks[Symbol.for('skip-override')] = true;

module.exports = hooks;
