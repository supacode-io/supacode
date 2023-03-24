const bcrypt = require('bcrypt');

const { sql } = require('../../../helpers/db-helper');

const updateUser = async (params, data) => {
	const { user_id } = params;
	const { name, email, password } = data;
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await sql.begin(async (t) => {
		const updateuser = await t`--sql
	        update _cms.users
            set name =${name} , email =${email},password=${hashedPassword}
            where id=${user_id}
            returning *
	        `;
		return updateuser[0];
	});
	return user;
};

const routes = async (fastify) => {
	fastify.patch('/v1/users/:user_id', async (request, reply) => {
		const { params, body } = request;
		const result = await updateUser(params, body);
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, updateUser };
