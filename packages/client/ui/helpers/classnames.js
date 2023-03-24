const NAMESPACE = 'su';

const cl = (...args) => {
	const [template, ...values] = args;
	let final = '';
	template.forEach((templateString) => {
		const value = values.shift() || '';
		final += (templateString.toString() + value.toString());
	});
	final = final.replace(/[\t\n]/g, ' ').trim();
	final = final.replace(/\s\s+/g, ' ').trim();
	return final;
};

cl.namespace = (classname) => {
	if (!classname) return '';
	return `${NAMESPACE}_${classname}`;
};

cl.ns = cl.namespace;

export default cl;
