import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

function ControlledSelect({
	name,
	defaultValue = null,
	rules,
	...rest
}) {
	const { control } = useFormContext();
	const { field } = useController({
		name,
		control,
		defaultValue,
		rules,
	});

	return (
		<ControlledSelect
			fill
			{...rest}
			{...field}
		/>
	);
}

export default ControlledSelect;
