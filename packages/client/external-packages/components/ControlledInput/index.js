import { InputGroup } from '@blueprintjs/core';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

function ControlledInput({
	name,
	defaultValue = null,
	rules,
	...rest
}) {
	const { control } = useFormContext();
	const { field } = useController({
		name, control, defaultValue, rules,
	});

	return (
		<InputGroup
			fill
			{...rest}
			{...field}
		/>
	);
}

export default ControlledInput;
