import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import UploadArea from '../../../ui/components/Uploadarea';

function ControlledUploadarea({
	name,
	defaultValue,
	rules,
	...rest
}) {
	const { control } = useFormContext();
	const { field } = useController({
		name, control, defaultValue, rules,
	});
	return (
		<UploadArea
			{...rest}
			{...field}
		/>
	);
}

export default ControlledUploadarea;
