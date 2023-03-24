const { sql } = require('../../../../helpers/db-helper');

const listLocales = async ({ project }) => {
	const { id: project_id } = project;

	const locales = await sql`
		select * from _cms.livewire_locales where project_id=${project_id}
	`;

	return { locales: locales || [] };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/livewire/locales', async (request, reply) => {
		const { project } = request;
		const result = await listLocales({ project });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listLocales };
