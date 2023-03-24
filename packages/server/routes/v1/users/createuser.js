const bcrypt = require('bcrypt');

const { sql } = require('../../../helpers/db-helper');

const createUsers = async (data) => {
	const { name, email, password } = data;

	const user = await sql.begin(async (t) => {
		const hashedPassword = await bcrypt.hash(password, 10);
		const createuser = await t`--sql
	        insert into _cms.users
	        ("name", "email", "password")
	        values
	        (${name}, ${email}, ${hashedPassword})
	        returning *
	        `;
		return createuser[0];
	});
	return user;
};

const routes = async (fastify) => {
	fastify.post('/v1/users', async (request, reply) => {
		const { body } = request;
		const result = await createUsers(body);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createUsers };
