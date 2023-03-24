const { sql } = require('../../../../helpers/db-helper');

const createCollection = async ({ project = {}, data = {} }) => {
	const { id: project_id } = project;
	const { name, code } = data;

	const [collection] = await sql`
		insert into _cms.livewire_collections (name, code, project_id)
        values (${name}, ${code}, ${project_id})
        returning *
	`;

	return { collection };
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/livewire/collections', async (request, reply) => {
		const { project, body } = request;
		const result = await createCollection({ project, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createCollection };
