const bcrypt = require('bcrypt');
const omit = require('lodash/omit');

const { sql } = require('../../../helpers/db-helper');
const { UnauthorizedError } = require('../../../helpers/error-helper');
const { initializeSession } = require('../../../helpers/session-helper');

const findValidUser = async ({ params = {} }) => {
	const { email, password } = params;

	const [user] = await sql`
        select id, name, email, password, created_on, updated_on 
		from ${sql('_cms.users')}
        where email=${email}
    `;

	if (!user) {
		throw new UnauthorizedError('User doesn\'t exist');
	}

	const valid = await bcrypt.compare(password, user.password);

	if (!valid) {
		throw new UnauthorizedError('Invalid Credentials');
	}

	return omit(user, ['password']);
};

const routes = async (fastify) => {
	fastify.post('/v1/auth/login', async (request, reply) => {
		const { body } = request;
		const user = await findValidUser({ params: body });

		const { sessionId, session } = await initializeSession({ user });
		const result = { sessionId, session };
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, findValidUser };
