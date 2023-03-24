const { sql } = require('../../../helpers/db-helper');

const listUsers = async () => {
	const users = await sql`--sql
		select * from _cms.users
	`;
	return users;
};

const routes = async (fastify) => {
	fastify.get('/v1/users', async (request, reply) => {
		const result = await listUsers();
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, listUsers };
