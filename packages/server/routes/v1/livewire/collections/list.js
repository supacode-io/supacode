const { sql } = require('../../../../helpers/db-helper');

const listCollections = async ({ project }) => {
	const { id: project_id } = project;

	const collections = await sql`
		select * from _cms.livewire_collections where project_id=${project_id}
	`;

	return { collections: collections || [] };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/livewire/collections', async (request, reply) => {
		const { project } = request;
		const result = await listCollections({ project });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listCollections };
