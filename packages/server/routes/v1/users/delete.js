const { sql } = require('../../../helpers/db-helper');

const deleteUser = async (params) => {
	const { user_id } = params;

	const user = await sql.begin(async (t) => {
		const createuser = await t`--sql
	        delete  from _cms.users
            where id=${user_id}
	        returning *
	        `;
		return createuser;
	});
	return user;
};

const routes = async (fastify) => {
	fastify.delete('/v1/users/:user_id', async (request, reply) => {
		const { params } = request;
		const result = await deleteUser(params);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, deleteUser };
