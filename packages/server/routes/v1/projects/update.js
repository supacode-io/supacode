const { sql, sqlJoin } = require('../../../helpers/db-helper');

const updateProject = async ({ params = {}, data = {} }) => {
	const { name, code } = data;
	const { id } = params;

	return sql.begin(async (t) => {
		let [file] = await t`
			select * from _cms.projects
			where id=${id}
		`;

		const updatedValues = [];
		if (!!name && name !== file.name) {
			updatedValues.push(sql`${sql('name')}=${name}`);
		}
		if (!!code && code !== file.code) {
			updatedValues.push(sql`${sql('code')}=${code}`);
		}

		if (updatedValues.length > 0) {
			[file] = await sql`
				update _cms.projects
				set ${sqlJoin(updatedValues, sql`, `)}
				where id=${id}
				returning *
			`;
		}

		return { file };
	});
};

const routes = async (fastify) => {
	fastify.patch('/v1/projects/:project_id', async (request, reply) => {
		const { params, query, sessionStore, body } = request;
		const session = await sessionStore.get();
		const result = await updateProject({
			data: {
				...body,
			},
			params: {
				id      : params.project_id,
				user_id : session.user.id,
				q       : query.q,
			},
		});
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes };
