const { sqlJoin, sql } = require('../../../../helpers/db-helper');

const listVaultFiles = async ({ project = {}, q, limit = 10, offset = 0, desc, sortOption = 'created_on' }) => {
	const { id: project_id } = project;

	const whereClauses = [];
	if (q) whereClauses.push(sql`name ilike ${`%${q}%`}`);
	if (project_id) whereClauses.push(sql`project_id=${project_id}`);
	const sorting = desc === 'true' ? sql`ASC` : sql`DESC`;

	return sql.begin(async (t) => {
		const files = await t`--sql
			select * from ${sql('_cms.vault_files')}
			${whereClauses.length > 0 ? sql`where ${sqlJoin(whereClauses, sql` and `)}` : sql``}
			order by ${sql([sortOption])} ${sorting}
			limit ${limit} offset ${offset}
		`;

		const [{ count: total }] = await t`--sql
			select count(id) from ${sql('_cms.vault_files')}
			${whereClauses.length > 0 ? sql`where ${sqlJoin(whereClauses, sql` and `)}` : sql``}
		`;

		return { files, total: parseInt(total, 10), limit, offset, desc, sortOption };
	});
};

const routes = async (fastify) => {
	fastify.get('/v1/:project_code/vault/files', async (request, reply) => {
		const { query, project } = request;
		const { limit, offset, q, desc, sortOption } = query;
		const result = await listVaultFiles({ project, q, limit, offset, desc, sortOption });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listVaultFiles };
