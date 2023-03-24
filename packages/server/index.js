require('./helpers/load-env');

const Fastify = require('fastify');
const qs = require('qs');

const plugins = require('./plugins');
const routes = require('./routes');

const start = async () => {
	const fastify = Fastify({
		logger            : true,
		querystringParser : (str) => qs.parse(str),
	});

	await fastify.register(plugins);
	await fastify.register(routes);

	try {
		const port = process.env.PORT || 3000;
		await fastify.listen({ port });
		if (typeof process.send === 'function') process.send('ready');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
