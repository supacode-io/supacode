import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import RTEditor from './RTEditor';

function ControlledRTEditor({
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
		<RTEditor
			{...rest}
			{...field}
		/>
	);
}

export default ControlledRTEditor;
