const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const { queryListContent } = require('./_common');

const getContent = async ({ project = {}, params = {} }) => {
	const { id: project_id } = project;
	const { collection_code, locale_code, key } = params;

	const [locale] = await sql`--sql
		select * from _cms.livewire_locales
		where
			project_id=${project_id}
			and ${locale_code ? sql`code=${locale_code}` : sql`is_default=true`}
	`;

	if (!locale) {
		throw new NotFoundError('Locale does not exist');
	}

	const [collection] = await sql`--sql
		select * from _cms.livewire_collections
		where
			project_id=${project_id}
			and code=${collection_code}
	`;

	if (!collection) {
		throw new NotFoundError('Collection does not exist');
	}

	const [content] = await queryListContent(sql, { collection_id: collection.id, locale_id: locale.id, key });

	if (!content) {
		throw new NotFoundError('Key does not exist');
	}

	return { content };
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/livewire/contents/:collection_code/:key', async (request, reply) => {
		const { project, params, query } = request;
		const result = await getContent({ project, params: { ...params, ...query } });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, getContent };
