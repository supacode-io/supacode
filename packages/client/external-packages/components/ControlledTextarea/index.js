import { TextArea } from '@blueprintjs/core';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

function ControlledTextarea({
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
		<TextArea
			fill
			rows={3}
			{...rest}
			{...field}
		/>
	);
}

export default ControlledTextarea;
