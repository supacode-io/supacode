const uid = require('uid-safe');

const redis = require('./redis-helper');

const sessionStorePrefix = 'cms:sess:';

const getSessionStoreKey = (sessionId) => `${sessionStorePrefix}${sessionId}`;

const getSession = async (sessionId) => {
	if (!sessionId) {
		return null;
	}
	const key = getSessionStoreKey(sessionId);
	const serializedSession = await redis.get(key);
	return JSON.parse(serializedSession);
};

const setSession = async (sessionId, session) => {
	if (!sessionId) {
		return null;
	}
	const key = getSessionStoreKey(sessionId);
	const serializedSession = JSON.stringify(session);
	await redis.set(key, serializedSession);
	return null;
};

const destroySession = async (sessionId) => {
	if (!sessionId) {
		return false;
	}
	const key = getSessionStoreKey(sessionId);
	await redis.del(key);
	return true;
};

const initializeSession = async (initialSessionData = {}) => {
	const sessionId = await uid(32);
	await setSession(sessionId, initialSessionData);
	return { sessionId, session: initialSessionData };
};

module.exports = {
	getSession,
	setSession,
	destroySession,
	initializeSession,
};
