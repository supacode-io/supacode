/* eslint-disable max-classes-per-file */
class ExtendedError extends Error {}

class UnauthorizedError extends ExtendedError {
	constructor(message) {
		super(message);
		this.statusCode = 401;
		this.code = 'ERR_UNAUTHORIZED';
	}
}

class ForbiddenError extends ExtendedError {
	constructor(message) {
		super(message);
		this.statusCode = 403;
		this.code = 'ERR_FORBIDDEN';
	}
}

class NotFoundError extends ExtendedError {
	constructor(message) {
		super(message);
		this.statusCode = 404;
		this.code = 'ERR_NOTFOUND';
	}
}

class ValidityError extends ExtendedError {
	constructor(message) {
		super(message);
		this.statusCode = 400;
		this.code = 'ERR_INVALID';
	}
}

class DuplicateError extends ExtendedError {
	constructor(message) {
		super(message);
		this.statusCode = 409;
		this.code = 'ERR_DUPLICATE';
	}
}

module.exports = {
	ExtendedError,
	ForbiddenError,
	UnauthorizedError,
	NotFoundError,
	ValidityError,
	DuplicateError,
};
