const flattenErrorToString = (err) => {
	if (err === null || typeof err === 'undefined') {
		return '';
	}

	if (typeof err === 'string') {
		return err;
	}

	if (typeof err === 'number') {
		return err.toString();
	}

	if (typeof err === 'boolean') {
		return err ? 'True' : 'False';
	}

	if (Array.isArray(err)) {
		return err
			.map(flattenErrorToString)
			.join('. ');
	}

	if (err instanceof Error) {
		return err.toString();
	}

	if (typeof err === 'object') {
		return Object
			.keys(err)
			.map((key) => `${flattenErrorToString(err[key])}`)
			.join('. ');
	}

	return '';
};

export default flattenErrorToString;
