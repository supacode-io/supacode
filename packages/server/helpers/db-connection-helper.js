const { createPool } = require('slonik');
const { createQueryLoggingInterceptor } = require('slonik-interceptor-query-logging');

const ALIVE_CONNECTIONS = new Map();

async function getConnectionPool() {
	let pool = ALIVE_CONNECTIONS.get('cms');
	if (!pool) {
		const interceptors = [createQueryLoggingInterceptor()];
		pool = await createPool(process.env.DATABASE_URL, { interceptors });
		ALIVE_CONNECTIONS.set('cms', pool);
	}
	return pool;
}

module.exports = { getConnectionPool };
