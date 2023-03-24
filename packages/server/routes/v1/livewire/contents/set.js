const { sql } = require('../../../../helpers/db-helper');
const { ValidityError } = require('../../../../helpers/error-helper');

const { queryListContent } = require('./_common');

const setContent = async ({ project = {}, params = {}, data = {} }) => {
	const { id: project_id } = project;
	const { collection_code, key } = params;
	const { value, locale_code } = data;
	return sql.begin(async (t) => {
		const [locale] = await t`--sql
			select * from _cms.livewire_locales
			where
				project_id=${project_id}
				and ${locale_code ? sql`code=${locale_code}` : sql`is_default=true`}
		`;

		if (!locale) {
			throw new ValidityError('Locale does not exist');
		}

		const [collection] = await t`--sql
			select * from _cms.livewire_collections
			where
				project_id=${project_id}
				and code=${collection_code}
		`;

		if (!collection) {
			throw new ValidityError('Collection does not exist');
		}

		await t`--sql
			insert into _cms.livewire_contents ("collection_id", "locale_id", "key", "value")
			values (${collection.id}, ${locale.id}, ${key}, ${value})
			on conflict ("collection_id", "locale_id", "key")
			do update set "value"=excluded."value"
		`;

		const [content] = await queryListContent(t, { collection_id: collection.id, locale_id: locale.id, key });

		return { content };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/livewire/contents/:collection_code/:key', async (request, reply) => {
		const { project, params, body } = request;
		const result = await setContent({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, setContent };
