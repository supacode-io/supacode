const { sql } = require('../../../helpers/db-helper');

const { queryListProjects } = require('./_common');

const createProject = async ({ data = {} }) => {
	const { name, code, user_id } = data;

	const [project] = await sql.begin(async (t) => {
		const [rawProject] = await t`--sql
		    insert into _cms.projects (name, code)
		    values (${name}, ${code})
		    returning *
		`;

		await t`--sql
		    insert into _cms.project_users (project_id, user_id, role)
		    values (${rawProject.id}, ${user_id}, 'owner')
		`;

		await t`--sql
		    insert into _cms.livewire_locales (code, project_id, is_default)
			values ('en-IN', ${rawProject.id}, ${true})
			
		`;

		const schema_name = `public__${code}`;
		// ${sql(`${schema_name}.${table_name}`)}
		await t`--sql 
			create schema ${sql(`${schema_name}`)}
		`;

		return queryListProjects(t, { id: rawProject.id, user_id });
	});

	if (project) {
		delete project.user.password;
	}

	return { project };
};

const routes = async (fastify) => {
	fastify.post('/v1/projects', async (request, reply) => {
		const { body, sessionStore } = request;
		const session = await sessionStore.get();
		const result = await createProject({
			data: {
				...body,
				user_id: session.user.id,
			},
		});
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createProject };
