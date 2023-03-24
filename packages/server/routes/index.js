/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs/promises');
const path = require('path');

const hooks = require('./v1/hooks');

const registerFolder = async (fastify, dirArg) => {
	const dir = dirArg.startsWith('./') ? dirArg : `./${dirArg}`;
	const fileNames = await fs.readdir(path.resolve(__dirname, dir));
	const promises = fileNames.reduce((acc, fileName) => {
		const requirePath = `${dir}/${fileName}`;
		const { default: plugin } = require(requirePath);
		if (!fileName.startsWith('_')) {
			if (typeof plugin === 'function' || plugin instanceof Promise) {
				fastify.log.info(`Loaded route from ${requirePath}`);
				acc.push(fastify.register(plugin, {}));
			}
		}
		return acc;
	}, []);
	await Promise.all(promises);
};

const routes = async (fastify) => {
	fastify.log.info('Registering Hooks');
	await fastify.register(hooks);
	fastify.log.info('Registering Routes');
	await registerFolder(fastify, 'v1/auth');
	await registerFolder(fastify, 'v1/users');
	await registerFolder(fastify, 'v1/projects');
	await registerFolder(fastify, 'v1/livewire/collections');
	await registerFolder(fastify, 'v1/livewire/locales');
	await registerFolder(fastify, 'v1/livewire/contents');
	await registerFolder(fastify, 'v1/datastore/columns');
	await registerFolder(fastify, 'v1/datastore/tables');
	await registerFolder(fastify, 'v1/datastore/rows');
	await registerFolder(fastify, 'v1/vault/files');
	await registerFolder(fastify, 'v1/health');
	await registerFolder(fastify, 'v1/configstore');
};

module.exports = routes;
