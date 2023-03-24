const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');

const deleteCollection = ({ params = {} }) => {
	const { collection_id } = params;
	return sql.begin(async (t) => {
		let [collection] = await t`--sql
			select id from _cms.livewire_collections
			where id=${collection_id}
			`;

		if (!collection) {
			throw new NotFoundError(`Collection with id '${collection_id}' not found`);
		}
		await t`--sql
		    delete from _cms.livewire_contents
		        where collection_id=${collection_id}
		    `;

		[collection] = await t`--sql
				delete from _cms.livewire_collections
				where id=${collection_id}
				returning *
			`;
		return { collection };
	});
};

const routes = async (fastify) => {
	fastify.delete('/v1/:project_code/livewire/collections/:collection_id', async (request, reply) => {
		const { params } = request;
		const result = await deleteCollection({ params });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
