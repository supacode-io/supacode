const { sql } = require('../../../../helpers/db-helper');
const { ValidityError } = require('../../../../helpers/error-helper');

const createLocale = async ({ project = {}, data = {} }) => {
	const { id: project_id } = project;
	const { locale_code } = data;

	return sql.begin(async (t) => {
		const [locale] = await t`--sql
			select * from _cms.livewire_locales
			where
				project_id=${project_id}
				and code=${locale_code}
		`;

		if (locale) {
			throw new ValidityError('Locale already exists');
		}

		const [newLcoale] = await sql`
			insert into _cms.livewire_locales (code, is_default, project_id)
        	values (${locale_code}, ${false}, ${project_id})
        	returning *
		`;

		return { newLcoale };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/livewire/locales', async (request, reply) => {
		const { project, body } = request;
		const result = await createLocale({ project, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createLocale };
